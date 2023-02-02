import { render, screen } from '@testing-library/react'
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/react'

// jest.mock('next-router')
jest.mock('next-auth/react')
jest.mock('../../services/stripe')

describe('Home Page', () => {

    it('renders correctly', () => {

        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
        })

        render(<Home product={{
            priceId: 'fake-price-id',
            amount: 'R$9.90'
        }} />)

        expect(screen.getByText("for R$9.90 month")).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const retriveStripePriceMocked = mocked(stripe.prices.retrieve)

        retriveStripePriceMocked.mockResolvedValueOnce(
            {
                id: 'fake-prices-id',
                unit_amount: 1000
            } as any
        )
        
        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-prices-id',
                        amount: '$10.00'
                    }
                }
            })
        )
    })
})