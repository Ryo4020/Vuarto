<template>
  <div
    v-if="!used"
    :class="[pieceList[this.i - 1].color,
             pieceList[this.i - 1].shape,
             'piece',
             {select: i === selectedPiece}]"
    @click="selectPiece">
    {{ pieceList[this.i - 1].display }}
  </div>
</template>

<script>
import { PIECE_LIST } from "@/mixins/pieceList";

export default {
    name: "Piece",
    props: ['i', 'selectedPiece', 'situation'],
    data() {
        return {
            pieceList: PIECE_LIST,
            used: false,
            usedPotionId: null,
        };
    },
    watch: {
      situation() {
        switch(this.situation) {
          case 0:
            this.used = false;
            this.usedPotionId = null;
            break;
          case 1:
            if (this.usedPotionId === this.i) {
              this.used = !this.used;
            }
            break;
          case -1:
            this.usedPotionId = this.selectedPiece;
            break;
        }
      },
    },
    methods: {
        selectPiece() {
          if (this.situation === 1) {
            this.$emit("click-event", this.i);
          }
        },
    },
};
</script>

<style scopped>
.piece {
    font-size: 24px;
    width: 52px;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
}

.red {
    color: red;
    background: rgba(255, 125, 125, 0.5);
    border-color: red !important;
}

.blue {
    color: blue;
    background: rgba(125, 125, 255, 0.5);
    border-color: blue !important;
}

.select {
  background: rgb(224, 224, 224) !important;
}
</style>