import { Link } from 'react-router-dom'
import { useLanguage } from '../context/language'
export default function NotFoundPage(){const{language}=useLanguage();const es=language==='es';return <section className="not-found"><span>404</span><h1>{es?'Esta página tomó otro turno.':'This page took another shift.'}</h1><p>{es?'Volvamos a un lugar útil.':'Let’s get you somewhere useful.'}</p><Link className="button" to="/">{es?'Volver al inicio':'Back Home'}</Link></section>}
