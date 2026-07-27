type BotTrapProps = {
  onChange: (value: string) => void
  value: string
}

function BotTrap({ onChange, value }: BotTrapProps) {
  return (
    <div aria-hidden="true" className="form-honeypot">
      <label htmlFor="website-confirmation">
        Leave this field blank
        <input
          autoComplete="off"
          id="website-confirmation"
          name="website"
          onChange={(event) => onChange(event.target.value)}
          tabIndex={-1}
          type="text"
          value={value}
        />
      </label>
    </div>
  )
}

export default BotTrap
