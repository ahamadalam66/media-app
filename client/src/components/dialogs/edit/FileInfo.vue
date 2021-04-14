<template>
	<div class="mb-2">
		<div class="text-subtitle-2">
	    Uploaded on: <span class="text-body-2">{{ formatDate(file.uploaded_at) }}</span>
	  </div>
	  <div class="text-subtitle-2">
	    File type: <span class="text-body-2">{{ file.mime_type }}</span>
	  </div>
	  <div class="text-subtitle-2">
	    File size: <span class="text-body-2">{{ getFileSize(file) }}</span>
	  </div>
	  <div 
	    class="text-subtitle-2" 
	    v-if="['image/jpeg', 'image/png', 'image/webp'].includes(file.mime_type)"
	  >
	    Dimensions: <span class="text-body-2">{{ file.dimensions }}</span>
	  </div>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState: editMapState } = createNamespacedHelpers('edit')
export default {
	name: 'FileInfo',

	computed: {
		...editMapState({ file: state => state.file })
	},

	methods: {
		getFileSize: function(file) {
      let size = file.size

      const sizes = ['B', 'KB', 'MB', 'GB']
      let i = 0

      while(size > 1023 && i < sizes.length) {
        size /= 1024
        i++
      }

      size = Math.floor(size)

      return `${size}${sizes[i]}`
    },
    formatDate: function(dateString) {
    	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

      const date = new Date(dateString)

      let dd = date.getDate()
      const mm = monthNames[date.getMonth()]
      const yyyy = date.getFullYear()

      if(dd < 10) {
      	dd = `0${dd}`
      }

      return `${mm} ${dd}, ${yyyy}`
    },
	}
}
</script>
