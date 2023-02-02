import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'

jest.mock('next-auth/react')
jest.mock('next/router')


describe('SubscribeButton Component', () => {
    it('renders correctly when user is not logged in', () => {

        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
          })

        render(
            <SubscribeButton priceId={''} />
        )

        expect(screen.getByText('Subscribe Now')).toBeInTheDocument()
    })

    it('redirects user to sign in when user not is logged in', () => {
        const signInMocked = mocked(signIn)
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });


        render(<SubscribeButton priceId={''} />)

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })

    it('redirects to posts page when user already have an active subscription', () => {

        const useSessionMocked = jest.mocked(useSession)
        const useRouterMocked = jest.mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce({
            data: {
                user: { name: "John Doe", email: "john.doe@example.com" },
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires'
            },
            status: "authenticated",
        });

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(
            <SubscribeButton priceId={''} />
        )

        const subscribeButton = screen.getByText('Subscribe Now')

        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalledWith('/posts')
    })
})