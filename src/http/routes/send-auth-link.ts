import { createId } from '@paralleldrive/cuid2'
import { render } from '@react-email/render'
import Elysia, { t } from 'elysia'

import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
import { ENV } from '../../env'
import { mail } from '../../lib/mail'
import { AuthenticationMagicLinkTemplate } from '../../lib/templates/authentication-magic-link-template'

export const sendAuthLink = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email } = body

    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    if (!userFromEmail) {
      throw new Error('User not found')
    }

    const authLinkCode = createId()

    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    })

    // TODO: send an email

    const authLink = new URL('/auth-links/authenticate', ENV.API_BASE_URL)
    authLink.searchParams.set('code', authLinkCode)
    authLink.searchParams.set('redirect', ENV.AUTH_REDIRECT_URL)

    await mail.sendMail({
      from: {
        name: 'Pizza Shop',
        address: 'no-replay@pizzashop.com',
      },
      to: {
        name: userFromEmail.name,
        address: email,
      },
      subject: '[Pizza Shop] Link para login',
      text: render(
        AuthenticationMagicLinkTemplate({
          authLink: authLink.toString(),
          userEmail: email,
        }),
        {
          plainText: true,
        },
      ),
      html: render(
        AuthenticationMagicLinkTemplate({
          authLink: authLink.toString(),
          userEmail: email,
        }),
      ),
    })
  },
  {
    body: t.Object({ email: t.String({ format: 'email' }) }),
    detail: {
      tags: ['Auth'],
    },
  },
)
