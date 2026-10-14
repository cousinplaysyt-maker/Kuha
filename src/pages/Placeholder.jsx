import tarsee from '../assets/tarsee.svg'
export default function Placeholder({ name }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 text-center">
      <div>
        <img src={tarsee} alt="Tarsee" className="w-28 h-28 mx-auto mb-4" />
        <h1 className="font-headline-md text-headline-md">{name}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Coming soon. Send me the HTML for this page.</p>
      </div>
    </div>
  )
}
