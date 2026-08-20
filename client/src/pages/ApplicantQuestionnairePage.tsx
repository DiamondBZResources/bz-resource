import { Navigate, useParams } from 'react-router-dom'
import ApplicationForm from '../components/ApplicationForm'
import PageHero from '../components/PageHero'
import type { Language } from '../context/language'

export default function ApplicantQuestionnairePage(){const{language}=useParams();if(language!=='en'&&language!=='es')return <Navigate to="/forms" replace/>;const es=language==='es';return <><PageHero eyebrow={es?'Candidatos':'Applicants'} title={es?'Cuestionario de Candidato':'Applicant Questionnaire'} text={es?'Comparta su experiencia, disponibilidad y objetivos de trabajo.':'Share your experience, availability and work goals.'} meta={es?'Formulario seguro':'Secure form'}/><section className="section form-page-section"><div className="container-form"><ApplicationForm kind="applicant-questionnaire" language={language as Language}/></div></section></>}
