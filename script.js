// =,==,===

// primitive 

// [] {} referans

class Person {
    constructor(firstname,lastname, email) {
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
    }


}


class Util {
static checkEmptyFields(...fields) {
    let result = true

    fields.forEach(field=> {
        if(field.length ===0) {
             result = false
             return false
        }


    })

    return result
}

static checkEmailValidty(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())

}

}

class Screen {
    constructor() {
        this.firstname = document.getElementById('firstname')
        this.lastname = document.getElementById('lastname')
        this.email = document.getElementById('mail')

        this.addUpdateBtn = document.querySelector('.saveandupdate')
        this.form = document.getElementsByTagName('form')[0]
        this.form.addEventListener('submit', this.saveAndUpdate.bind(this))

        this.personList = document.getElementsByClassName('person-list')[0]

        this.personList.addEventListener('click', this.updateOrDelete.bind(this))

        this.db = new DB()

        this.selectedRow = undefined

        this.printPersonToScreen()

    }

    saveAndUpdate() {

    }
}







class DB {
    constructor() {
        this.allPersons = this.getAllPersons()
    }

    isEmailUnique(email) {
        const result = this.allPersons.find(person => {
            return person.email === email
        })

        if(result) {
            console.log("burada xeta bash vererse")

            return false
        }
        else {
            // bu elektron poct yenilene biler 
            return true
        }
    }

    getAllPersons() {
        let allPersonsLocal

        // [{ad: "Rauf"}]

        if(localStorage.getItem('allPersons') === null) {
            allPersonsLocal = []
        }

        else {
            allPersonsLocal = JSON.parse(localStorage.getItem('allPersons'))
        }
    }

    addPerson(person) {
        if(this.isEmailUnique(person.email)) {
            this.allPersons.push(person)
            localStorage.setItem('allPersons', JSON.stringify(this.allPersons) )

            return true

        }

        else {
            return false
        }
    }

    deletePerson(email) {

        this.allPersons.forEach((person,index)=> {
            if(person.email === email) { 
                this.allPersons.splice(index,1)
            }
        })

        localStorage.setItem('allPersons', JSON.stringify(this.allPersons))
    }

    updatePerson(email, updatedPerson) {
        if(this.allPersons.email === email) {
            this.allPersons.forEach((person,index)=> {
                if(person.email === email) {
                    console.log("Istifadeci tapildi")
                    this.allPersons[index] = updatedPerson
                    localStorage.setItem('allPersons', JSON.stringify(this.allPersons))
                    return true
                }

            })

            return true
        }

        if(this.isEmailUnique(updatedPerson.email)) {
            // bu o demekdir ki biz melumati yenileye bilerik

            this.allPersons.forEach((person,index)=> {
                if(person.email === email) {
                    console.log("Istifadeci tapildi")
                    this.allPersons[index] = updatedPerson
                    localStorage.setItem('allPersons', JSON.stringify(this.allPersons))
                    return true
                }

            })

            return true
        }

        else {
            console.log("Bu elektron poct istifadedir ve yenilene bilmez!")
            return false
        }



        


    }

}

document.addEventListener('DOMContentLoaded', function(){
    const screen = new Screen()
})



// class icerisinde this hemin obyekti (classi) referans verir

// console.log(window)

// const students  = {
//     firstname:"Afsar",
//     lastname: "Rahimli"
// }