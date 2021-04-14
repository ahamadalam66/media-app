<template>
  <nav>
    <v-app-bar
      app
      dense
      color="primary"
      dark
      v-if="$vuetify.breakpoint.mobile"
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>Media App</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      color="primary"
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon class="white--text">mdi-folder-multiple-image</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="white--text">Media Library</v-list-item-title>
          </v-list-item>

          <v-list-item to='/uploads'>
            <v-list-item-icon>
              <v-icon class="white--text">mdi-plus-box-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="white--text">Add New</v-list-item-title>
          </v-list-item>
          
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
  export default {
    name: 'Appbar',

    data: function() {
      return {
        drawer: false
      }
    },

    created: function() {
      if(!this.$vuetify.breakpoint.mobile) {
        this.drawer = true
      }
    }

  }
</script>
