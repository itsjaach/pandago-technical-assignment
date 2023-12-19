import { createStore } from 'vuex'
import axios from 'axios'

const store = createStore({
  state: {
    pokemons: new Map()
  },
  mutations: {
    addPokemons(state, transformedPokemons) {
      transformedPokemons.forEach((pokemon) => state.pokemons.set(pokemon.name, pokemon))
    },
    savePokemonsData(state) {
      const pokemonsArray = Array.from(state.pokemons.values())
      localStorage.setItem('pokemons', JSON.stringify(pokemonsArray))
    }
  },
  actions: {
    async loadPokemons({ commit }) {
      axios
        .get('https://pokeapi.co/api/v2/pokemon?limit=1017')
        .then(async function (response) {
          const pokemons = response.data.results
          const chunkSize = 50
          const pokemonList = []
          for (let i = 0; i < pokemons.length; i += chunkSize) {
            /*
              By dividing the pokemon list into chunks of 50, it allows the app
              to make the API requests for each 50 pokemons in parallel, allowing
              the user to see pokemons from the first second, while the rest of them
              are loading as the requests get processed
            */
            const chunks = pokemons.slice(i, i + chunkSize)
            const promises = chunks.map((pokemon) =>
              axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            )
            const results = await Promise.all(promises)
            results.forEach((response) => pokemonList.push(response.data))
            
            const transformedPokemons = pokemonList.map((pokemon) => ({
              /*
                Since the PokeAPI provides a huge data structure for every pokemon, 
                this method will "clean it up", so it'll only have the properties
                the app will use
              */
                abilities: pokemon.abilities.map((ability) => ability.ability.name),
                moves: pokemon.moves.map((move) => move.move.name),
                stats: pokemon.stats.map((stat) => ({
                    name: stat.stat.name,
                    base: stat.base_stat

                })),
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.front_default,
                types: pokemon.types.map((type) => type.type.name) 
              }))
            commit('addPokemons', transformedPokemons)
          }
        })
        .then(() => commit('savePokemonsData'))
    }

  }
})

export default store