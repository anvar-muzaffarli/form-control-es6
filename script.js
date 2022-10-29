// =,==,===

// primitive 

// [] {} referans


class Person {
    constructor(firstname,lastname, email) {
        this.firstname = firstname
        this.lastname = lastname
        this.email = email
    }



   

    /*
   const person =  {
        firstname:inputdan gelen,
        lastname:
    }
    

    person.firstname


    */

   


}


// const yeniFunksiya = new Util()
// yeniFunksiya.checkEmptyFields



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
        this.form = document.getElementById('contact-form')
        this.form.addEventListener('submit', this.saveAndUpdate.bind(this))

        this.personList = document.getElementsByClassName('person-list')[0]

        this.personList.addEventListener('click', this.updateOrDelete.bind(this))

        this.db = new DB()

        this.selectedRow = undefined

        this.printPersonToScreen()

    }


    updateOrDelete(e) {
        const kliklenmeYeri = e.target

        if(kliklenmeYeri.classList.contains('btn--delete')) {
            this.selectedRow=kliklenmeYeri.parentElement.parentElement
            this.deletePersonFromScreen()
        }

        else if(kliklenmeYeri.classList.contains('btn--edit')) {
            this.selectedRow = kliklenmeYeri.parentElement.parentElement
            this.addUpdateBtn.value = 'Yenile'
            this.firstname.value = this.selectedRow.cells[0].textContent
            this.lastname.value = this.selectedRow.cells[1].textContent
            this.email.value = this.selectedRow.cells[2].textContent
        }
    }


    deletePersonFromScreen() {
        this.selectedRow.remove()

        const silinecekMail = this.selectedRow.cells[2].textContent

        this.db.deletePerson(silinecekMail)

        this.selectedRow = undefined
        this.createNotification('Kontakt silindi', true)

    }


    createNotification(message, status) {
        const infoDiv = document.querySelector('.info')
        infoDiv.innerHTML = message

        infoDiv.classList.add(status ? 'info--success' : 'info--error' )

        setTimeout(function() {
            infoDiv.className = 'info'
        }, 3000)


    }

    saveAndUpdate(e) {
        e.preventDefault()

        const person = new Person(this.firstname.value, this.lastname.value, this.email.value)


        console.log(person) //proqram ishe dushende mutleq bu hisseye qayidaq 1

        const result = Util.checkEmptyFields(person.firstname, person.lastname, person.email)
        const checkEmailValidty = Util.checkEmailValidty(this.email.value)
        console.log(`${this.email.value} bunun ucun yoxlama bitdi netice : ${checkEmailValidty}`)

        if(result) {
            if(!checkEmailValidty) {
                this.createNotification('Elektron poct duzgun deyil', false)
                return 
            }

            if(this.selectedRow) {
                // bu o demekdir ki her hansi shexs haqqinda melumat var ve update ede bilerik
                this.updatePersonOnTheScreen(person)
            }

            else {
                // secilen setr undefineddir ve elave edilecek

                const result = this.db.addPerson(person)
                console.log(`Netice : ${result}`) //3-cu diqqet edilecek hisse

                if(result) {
                    this.createNotification('Melumat elave edildi', true)
                    this.addPersonToTheScreen(person) //bu hisseye az qalib
                    this.cleanAllFields()

                }

                else {
                    this.createNotification('Bu mail istifadedir', false)
                }

            }


        }

        else {
        // bezi saheler eskikdir
        this.createNotification('Bos saheleri doldur', false)
        }
    }

    cleanAllFields() {
        this.firstname.value = ''
        this.lastname.value = ''
        this.email.value = ''

    }

    

    printPersonToScreen() {
        this.db.allPersons.forEach(person=> {
            this.addPersonToTheScreen(person)
        })
    }


    // PROBLEMLI HISSE
    addPersonToTheScreen(person) {
        const yaradilanTR = document.createElement('tr')

        
        yaradilanTR.innerHTML = `<tr>
        <td>${person.firstname}</td>
        <td>${person.lastname}</td>
        <td>${person.email}</td>

        <td>
            <button class="btn btn--edit"><i class="far fa-edit"></i></button>
            <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
        </td>
       </tr>
        
        `

        this.personList.appendChild(yaradilanTR)

    }

    updatePersonOnTheScreen(person) {
        const result = this.db.updatePerson(person,this.selectedRow.cells[2].textContent)

        if(result) {
            this.selectedRow.cells[0].textContent = person.firstname
            this.selectedRow.cells[1].textContent = person.lastname
            this.selectedRow.cells[2].textContent = person.email


            this.cleanAllFields()
            this.selectedRow = undefined
            this.addUpdateBtn.value = 'Save'
            this.createNotification('Melumat ugurla update edildi', true)


        }

        else {
            this.createNotification('Yazdiginiz email istifadedir', false)
        }

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
            // bu elektron poct istifadeddir
            return false
        }
        else {
            // bu elektron poct yenilene biler 
            return true
        }
    }

    getAllPersons() {
        let allPersonsLocal //undefined

        // [{ad: "Rauf"}]

        if(localStorage.getItem('allPersons') === null) {
            allPersonsLocal = []
        }

        else {
            allPersonsLocal = JSON.parse(localStorage.getItem('allPersons'))
        }

        return allPersonsLocal
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
        if(updatedPerson.email === email) {
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