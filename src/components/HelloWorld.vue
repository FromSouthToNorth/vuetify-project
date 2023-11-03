<script lang="ts" setup>
//
import { log } from 'node:console'
import { ref } from 'vue'
import djiMavic3 from '@/assets/dji-mavic3.png'
import djiAri3 from '@/assets/dji-ari3.png'
import djiMini3 from '@/assets/dji-mini3.png'
import djiAri3_1 from '@/assets/ari3_1.jpg'
import djiAri3_2 from '@/assets/ari3_2.jpg'
import djiMavic3_1 from '@/assets/mavic3pro_1.jpg'
import djiMavic3_2 from '@/assets/mavic3pro_2.jpg'
import djiMini3_1 from '@/assets/mini3_1.jpg'
import djiMini3_2 from '@/assets/mini3_2.jpg'

const cards = [
  {
    title: 'Mavic 3 Pro',
    imgsrc: djiMavic3,
    flex: 12,
    height: 200,
    imgSrcs: [
      djiMavic3_1,
      djiMavic3_2,
    ],
  },
  {
    title: 'Ari 3',
    imgsrc: djiAri3,
    flex: 6,
    height: 160,
    imgSrcs: [
      djiAri3_1,
      djiAri3_2,
    ],
  },
  {
    title: 'Mini 3',
    imgsrc: djiMini3,
    flex: 6,
    height: 160,
    imgSrcs: [
      djiMini3_1,
      djiMini3_2,
    ],
  },
]
const window = ref<number>(0)

const imgSrcs = ref(cards[0].imgSrcs)

function cardClick(index: number) {
  window.value = 0
  imgSrcs.value = cards[index].imgSrcs
}
</script>

<template>
  <v-container>
    <v-responsive>
      <v-row>
        <v-col :cols="4">
          <v-card
            class="mx-auto"
            max-width="500"
          >
            <v-row dense>
              <v-col
                v-for="(card, index) in cards"
                :key="index"
                :cols="card.flex"
              >
                <v-card
                  theme="dark"
                  @click="cardClick(index)"
                >
                  <v-img
                    class="align-end"
                    :height="card.height"
                    :src="card.imgsrc"
                    cover
                  >
                    <v-card-title class="text-white">
                      {{ card.title }}
                    </v-card-title>
                  </v-img>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-heart" />
                    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-bookmark" />
                    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-share-variant" />
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col :cols="8">
          <v-window
            v-model="window"
            show-arrows
          >
            <v-window-item
              v-for="(src, index) in imgSrcs" :key="index"
            >
              <v-card>
                <v-img :height="500" :src="src" />
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
