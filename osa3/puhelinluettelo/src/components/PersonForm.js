import React from "react"

const PersonForm = ({newName, handleNameChange, newNumber, handleNumberChange, addName}) => 
  <form onSubmit={addName}>
    <div>
      name: <input 
                type="text"
                value={newName} 
                onChange={handleNameChange}
            />
            <br></br>
      number: <input 
                value={newNumber}
                onChange={handleNumberChange}
              />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

export default PersonForm