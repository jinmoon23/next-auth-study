import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: '이메일', type: 'text', placeholder: '이메일 주소를 입력해 주세요.' },
                password: { label: '비밀번호', type: 'password' },
            },
            async authorize(credentials, req) {
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password,
                    }),
                })
                const user = await res.json()
                console.log('$$$user: ', user)

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },

        async session({ session, token }) {
            console.log('$$$ token: ', token)
            session.user = token as typeof session.user;
            console.log('$$$ session: ', session)
            return session;
        },
    },
})

export { handler as GET, handler as POST }