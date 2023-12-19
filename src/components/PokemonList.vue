<template>
  <v-card flat>
    <v-card-title class="d-flex align-center ga-1">
      <v-spacer></v-spacer>
      
      <span id="filter-description" class="visually-hidden">Select multiple types to filter Pokemons</span>
      <v-combobox
        v-model="selectedTypes"
        :items="pokeTypes"
        density="compact"
        chips
        clearable
        label="Filter Pokemons by Type"
        multiple
        closable-chips
        variant="outlined"
        class="search-fields"
        aria-describedby="filter-description"
      >
      </v-combobox>
      
      <v-text-field
        clearable
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        label="Search Pokemons"
        single-line
        flat
        hide-details
        variant="outlined"
        aria-label="Search Pokemons by name"
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      v-model:search="search"
      :items="filteredPokemons"
      :headers="headers"
      :filter-keys="['id', 'name']"
      fixed-header
      height="88vh"
      aria-label="List of Pokemons"
    >
      <template v-slot:item.name="{ item }">
        <router-link
          style="text-decoration: none; color: inherit"
          :to="{ path: '/pokemon/' + item.name }"
          aria-label="View details of: {{ item.name }}"
        >
          {{ item.name }}
        </router-link>
      </template>

      <template v-slot:item.image="{ item }">
        <v-card class="my-2" elevation="0" rounded>
          <v-img :src="item.image" height="90" width="90" cover alt="Image of: {{ item.name }}"></v-img>
        </v-card>
      </template>

      <template v-slot:item.types="{ item }">
        <div class="d-flex ga-1" role="list" aria-label="Types of: {{ item.name }}">
          <v-chip
            v-for="types in item.types"
            :key="types"
            :color="colors[types]"
            :text="types"
            class="text-uppercase"
            label
            size="small"
            role="listitem"
            @click="addType(types)"
          ></v-chip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { defineComponent } from 'vue'
import pokemonMixin from '../mixins/pokemonMixin'
export default defineComponent({
  name: "PokemonList",
  mixins: [pokemonMixin],
  data() {
    return {
      headers: [
        { title: '#', key: 'id' },
        { title: 'Name', key: 'name' },
        { title: 'Image', key: 'image', sortable: false },
        { title: 'Types', key: 'types', sortable: false }
      ],
      search: '',
      selectedTypes: []
    }
  },
  methods: {
    addType(type){
      // Adding the type to the filter by clicking on the type tag on the list
      if (!this.selectedTypes.includes(type)) {
        this.selectedTypes.push(type)
      }
    }
  },
  computed: {
    filteredPokemons() {
      if (this.selectedTypes.length === 0) {
        return [...this.pokemons.values()];
      }
      return [...this.pokemons.values()].filter(pokemon =>
        pokemon.types.some(type => this.selectedTypes.includes(type))
      );
    }
  }
})
</script>

<style scoped>
.search-fields {
  height: 40px
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
