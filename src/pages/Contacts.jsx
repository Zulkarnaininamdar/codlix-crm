import { useState } from 'react'
import PageHeader from '../components/common/PageHeader.jsx'
import { useCrm } from '../hooks/useCrm.js'
import { ChevronDownIcon, PhoneIcon, MailIcon, LinkedinIcon } from '../components/icons/Icons.jsx'
import '../components/common/PageHeader.css'
import './Contacts.css'

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

function Contacts() {
  const { items: companies } = useCrm('companies')
  const { items: contacts } = useCrm('contacts')
  const [openCompanies, setOpenCompanies] = useState({})

  const contactsByCompany = companies
    .map((c) => ({ company: c.name, contacts: contacts.filter((x) => x.companyId === c.id) }))
    .filter((group) => group.contacts.length > 0)

  function toggle(company) {
    setOpenCompanies((prev) => ({ ...prev, [company]: !(prev[company] ?? true) }))
  }

  const totalContacts = contactsByCompany.reduce((sum, c) => sum + c.contacts.length, 0)

  return (
    <div className="contacts-page">
      <PageHeader
        title="Contacts"
        subtitle={`${totalContacts} contacts across ${contactsByCompany.length} companies`}
      />

      <div className="contacts-tree">
        {contactsByCompany.map((group) => {
          const isOpen = openCompanies[group.company] ?? true
          return (
            <div className="contact-group" key={group.company}>
              <button className="contact-group__head" onClick={() => toggle(group.company)}>
                <span className="contact-group__name">{group.company}</span>
                <span className="contact-group__count">{group.contacts.length} contacts</span>
                <ChevronDownIcon className={`contact-group__chevron${isOpen ? ' is-open' : ''}`} />
              </button>

              {isOpen && (
                <ul className="contact-group__list">
                  {group.contacts.map((contact, i) => (
                    <li key={contact.id} className="contact-row">
                      <span className="contact-row__branch">{i === group.contacts.length - 1 ? '└──' : '├──'}</span>
                      <span className="contact-row__avatar">{initials(contact.name)}</span>
                      <div className="contact-row__info">
                        <p className="contact-row__name">{contact.name}</p>
                        <p className="contact-row__designation">{contact.designation}</p>
                      </div>
                      <div className="contact-row__meta">
                        <a href={`tel:${contact.phone}`}><PhoneIcon /> {contact.phone}</a>
                        <a href={`mailto:${contact.email}`}><MailIcon /> {contact.email}</a>
                        <span><LinkedinIcon /> {contact.linkedin}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Contacts
