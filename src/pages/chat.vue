<template>
  <div
    class="flex flex-col-reverse no-wrap w-full p-2 gap-y-2 overflow-y-scroll"
  >
    <button
      @click="test"
    >
      click me for dialog!
    </button>
    <div
      class="self-end bg-dark-base-3 px-2 rounded-t-md rounded-l-md max-w-lg"
    >
      text from me
    </div>
    <div
      class="self-start bg-dark-base-3 px-2 rounded-t-md rounded-r-md max-w-lg"
    >
      Nam imperdiet ultrices urna, nec iaculis neque tristique ac. Praesent mattis feugiat laoreet. Aliquam ut enim sed eros finibus egestas. Nulla ultricies erat quis pulvinar dapibus. Nulla facilisi. Duis pellentesque, mauris non lobortis dictum, enim libero pretium ligula, sit amet egestas nisi purus nec nulla. Aliquam sit amet est sed metus ullamcorper viverra. Donec tellus purus, dignissim id maximus vitae, luctus et tortor. Pellentesque accumsan finibus sapien maximus sodales. Mauris commodo tristique faucibus. Mauris mattis nibh id lectus vehicula ultricies. Vivamus ac purus ultrices, mollis odio ut, tempus ante. Nulla molestie sollicitudin nibh, facilisis pretium erat volutpat ut. Phasellus aliquet, eros quis dapibus sodales, purus nisl luctus ipsum, vitae maximus sem odio ut ipsum. Sed vestibulum id massa a faucibus. Suspendisse ac accumsan purus.
    </div>
    <div
      class="self-end bg-dark-base-3 px-2 rounded-t-md rounded-l-md max-w-lg"
    >
      text from me
    </div>
    <div
      class="self-start bg-dark-base-3 px-2 rounded-t-md rounded-r-md max-w-lg"
    >
      text from you
    </div>
    <div
      class="self-end bg-dark-base-3 px-2 rounded-t-md rounded-l-md max-w-lg"
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer augue libero, porttitor interdum odio sit amet, imperdiet consequat justo. Nam porttitor ligula ac blandit accumsan. Nulla blandit sed enim at luctus. Suspendisse blandit, purus a porta pulvinar, elit ante laoreet justo, a porttitor lectus eros id est. Phasellus ullamcorper lacus vestibulum neque pharetra volutpat. Maecenas vulputate turpis ut nisi finibus lobortis. Integer lacinia lorem eget pretium laoreet. Aliquam erat volutpat. Pellentesque ex arcu, sollicitudin et quam id, euismod viverra enim. Sed at nulla porta, faucibus lacus vitae, rhoncus risus. Curabitur mi ex, lacinia sed fermentum eu, viverra in lacus. Donec diam dui, facilisis vitae egestas et, egestas a nibh. In a velit id magna hendrerit semper. Aliquam cursus eleifend tortor et varius. Nam lorem odio, volutpat viverra sagittis at, consectetur id risus. Pellentesque feugiat massa nec purus lacinia, in fringilla dui hendrerit.
    </div>
  </div>
</template>

<script setup lang="ts">
import type Group from '~/assets/entities/group'
import { openDialog } from '~/components/core/dialog-manager'
import groupListItemVue from '~/components/list-items/group-list-item.vue'
import { useLocalUser } from '~/stores/local-user'

const test = () => {
  const user = useLocalUser().user
  if (user) {
    const test2: Group = { color: '#000', createdAt: new Date(), icon: 'none', id: '2', name: 'test', owner: user, preferences: { approveInvites: false }, users: [], invitationPermissionUsers: [] }

    openDialog(groupListItemVue, { value: test2 })
  }
}

</script>
