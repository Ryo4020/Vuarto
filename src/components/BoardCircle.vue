<template>
  <div class="box">
    <div
      v-if="access && situation === -1"
      class="circle"
      @click="selectCircle"
    ></div>
    <div v-else-if="access" class="circle"></div>
    <div v-else class="circle">
      <div :class="getPieceClass">
        {{ getPieceDisplay }}
      </div>
    </div>
  </div>
</template>

<script>
import { PIECE_LIST } from "@/mixins/pieceList";

export default {
  name: "BoardCircle",
  props: ["circleId", "i", "situation"],
  data() {
    return {
      getPieceClass: "", //置かれたコマのクラスリスト
      getPieceDisplay: "", //置かれたマスの文字
      pieceList: PIECE_LIST, //16種のコマ
      access: true, //まだコマがなければtrue
    };
  },
  watch: {
    //盤面を初期化
    situation() {
      if (this.situation === 0) {
        this.getPieceClass = "";
        this.getPieceDisplay = "";
        this.access = true;
      }
    },
  },
  methods: {
    //コマをマスに置く
    selectCircle() {
      this.access = !this.access;
      this.getPieceClass = [
        this.pieceList[this.i - 1].color,
        this.pieceList[this.i - 1].shape,
        "piece",
      ];
      this.getPieceDisplay = this.pieceList[this.i - 1].display;
      this.$emit("click-event", this.circleId, this.pieceList[this.i - 1]);
    },
  },
};
</script>

<style scopped lang="scss">
.box {
  width: 25%;
  height: 25%;
  padding: 4px;
  .circle {
    width: 82px;
    height: 82px;
    border: 1px solid black;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
      border-color: rgb(124, 184, 34);
    }
    .piece {
      font-size: 24px;
      width: 52px;
      height: 52px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid black;
      cursor: pointer;
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
  }
}
</style>