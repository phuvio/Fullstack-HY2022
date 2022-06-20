import React from "react"

const Persons = ({showUsers, remove}) => {
  return <>
      <span> 
        {showUsers.map(person => 
          <p key={person.name}>
            {person.name} {person.number}  
            <button onClick={() => remove(person)}>
              delete
            </button>
          </p>  
        )}
      </span>
    </>
}

export default Persons