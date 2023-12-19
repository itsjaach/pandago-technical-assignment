export default {
  data() {
    return {
      pokemonArray: [],
      colors: {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD'
      },
      pokeTypes: [
        'normal',
        'fire',
        'water',
        'electric',
        'grass',
        'ice',
        'fighting',
        'poison',
        'ground',
        'flying',
        'psychic',
        'bug',
        'rock',
        'ghost',
        'dragon',
        'dark',
        'steel',
        'fairy'
      ]
    }
  },
  async created() {
    await this.loadAllPokemons()
  },

  methods: {
    recoverDataFromLocalStorage() {
      this.pokemonArray = JSON.parse(localStorage.pokemons)
      /*
        When it gets the cached data, it'll store it in the store's state so that 
        it is the only "source of truth" and there are no conflicts between one
        pokemon item in a component and the one in the store's state
      */
      this.$store.commit('addPokemons', this.pokemonArray)
    },
    async loadAllPokemons() {
      if (localStorage.pokemons) {
        this.recoverDataFromLocalStorage()
      } else {
        await this.$store.dispatch('loadPokemons')
      }
    }
  },

  computed: {
    pokemons() {
      return this.$store.state.pokemons 
      /* 
        By accessing the pokemon map through a computed property rather than passing it in the data,
        it'll get it to be reactive to the changes in it, which will help to load all the data from the 
        API calls without impacting the user
      */
    }
  },
}
