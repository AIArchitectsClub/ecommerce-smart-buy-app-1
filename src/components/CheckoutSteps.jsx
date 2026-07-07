const STEPS = [
  { key: 'cart', label: 'Cart' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'receipt', label: 'Confirmation' },
]

export default function CheckoutSteps({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current)

  return (
    <ol className="checkout-steps">
      {STEPS.map((step, index) => {
        let state = 'upcoming'
        if (index < currentIndex) state = 'done'
        if (index === currentIndex) state = 'active'
        return (
          <li key={step.key} className={`checkout-step checkout-step-${state}`}>
            <span className="checkout-step-dot">{index + 1}</span>
            <span>{step.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
