import { GithubUser } from "./GitHubUsers.js"

class Favorites {
    constructor(root) {
        this.root = document.querySelectorAll(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
      }
    
    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username)
      
            if(userExists) {
              throw new Error('Usuário já cadastrado')
            }
      
            const user = await GithubUser.search(username)
      
            if(user.login === undefined) {
              throw new Error('Usuário não encontrado!')
            }
            
            this.entries = [user, ...this.entries]
            this.update()
            this.save()
      
          } catch(error) {
            alert(error.message)
          }
    }
    
    delete(user) {
      const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)
  
      this.entries = filteredEntries
      this.update()
      this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        
        this.tbody = document.querySelector('table tbody')
        this.noFavorites = document.querySelector('#no-favorites-wrapper')

        this.update()
        this.onAdd()
    }

    clearTableBody() {
        this.tbody.querySelectorAll('tr')
        .forEach((row) => {
            row.remove()
        })
    }

    createRow() {
        const row = document.createElement('tr')

        row.innerHTML = `
            <td class="user">
                <img src="https://github.com/pedrao-codes.png" alt="">
                <a href="https://github.com/pedrao-codes">
                    <p>Pedro Rocha</p>
                    <span>/pedrao-codes</span>
                </a>
            </td>
            <td class="repositories">123</td>
            <td class="followers">1234</td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `

        return row
    }

    onAdd() {
        const addButton = document.querySelector('.search button')
        addButton.onclick = () => {
          const inputUsername = document.querySelector('.search input')
          
          this.add(inputUsername.value)
          inputUsername.value = ""
        }
    }

    update() {
      
      this.clearTableBody()
      
      if(this.entries.length === 0) {
        this.noFavorites.classList.remove('hidden')
        console.log(this.entries.length)
        return
      }

      this.noFavorites.classList.add('hidden')
      console.log(this.entries.length)

      this.entries.forEach( user => {
        const row = this.createRow()
        
        row.querySelector('.user img').src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`
        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers
  
        row.querySelector('.remove').onclick = () => {
          const isOk = confirm('Tem certeza que deseja deletar essa linha?')
          if(isOk) {
            this.delete(user)
          }
        }
        
        this.tbody.append(row)
      })
    }
}