<template>
  <div>
    <div class="title">Vuarto</div>
    <div class="header">
      <div class="player left">
        <TextField :name="playerList[0].name" :id="playerList[0].id" @change-value="changeName" />
        <div class="turn-lamp" :class="playerList[0].turn ? `on` : `off`">V</div>
      </div>
      <div class="player right">
        <div class="turn-lamp" :class="playerList[1].turn ? `on` : `off`">S</div>
        <TextField :name="playerList[1].name" :id="playerList[1].id" @change-value="changeName" />
      </div>
    </div>
    <div class="message">{{ message }}</div>
    <div class="center">
      <button v-if="gameSituation === 0" @click="gameStart">START</button>
      <button v-else-if="gameSituation === 1 && pieceId === null" class="transparent" @click="missPiece">
        ENTER
      </button>
      <button v-else-if="gameSituation === 1" @click="enterPiece">
        ENTER
      </button>
      <button v-else-if="gameSituation === 2" @click="resetGame">
        RESET
      </button>
      <button v-else>
        ENTER
      </button>
      <button v-if="gameSituation === 1 && lastCircle !== null" @click="gameSet">
        VUARTO
      </button>
      <button v-else-if="gameSituation !== 0" :class="{transparent: gameSituation === -1}">
        VUARTO
      </button>
    </div>
    <div class="main">
      <div class="board">
        <BoardCircle
          v-for="n in 16"
          :key="n"
          :circleId="n"
          :i="pieceId"
          :situation="gameSituation"
          @click-event="selectCircle"
        />
      </div>
      <div class="piece-desk">
        <div v-for="m in 4" :key="m" class="piece-desk-small">
          <Piece
            v-for="n in 4"
            :key="n"
            :i="n + 4 * (m - 1)"
            :selectedPiece="pieceId"
            :situation="gameSituation"
            @click-event="selectPiece"
          />
        </div>
      </div>
    </div>
    <!-- <button @click="test">test</button> -->
  </div>
</template>

<script>
import TextField from "@/components/TextField.vue";
import BoardCircle from "@/components/BoardCircle.vue";
import Piece from "@/components/Piece.vue";

import { judgeResult } from "@/common/judgeResult";

export default {
  name: "Vuarto",
  components: {
    TextField,
    BoardCircle,
    Piece,
  },
  data() {
    return {
      playerList: [
        {
          id: 1,
          name: "",
          turn: false,
        },
        {
          id: 2,
          name: "",
          turn: false,
        },
      ],

      message: "STARTを押すとゲームが開始されます",
      gameSituation: 0,//０が初期、１がコマ、−１がマス、２が終了時
      pieceId: null,
      lastCircle: null,
      boardData: ["", "", "", "",],
    };
  },
  methods: {
    changeName(index, value) {
      this.playerList[index - 1].name = value;
    },
    gameStart() {
      this.gameSituation = 1;
      this.createBoardData();
      const first = Math.floor(Math.random() * 2);
      const second = first === 0 ? 1 : 0;
      this.playerList[first].turn = true;
      this.message = this.playerList[first].name + "さんが先攻です\n"
                     + this.playerList[second].name + "さんは渡すコマを選んでください";
    },
    enterPiece() {
      for (let i in this.playerList) {
        this.playerList[i].turn = !this.playerList[i].turn;
      }
      this.gameSituation = -1;
      if (this.playerList[0].turn) {
        this.message = this.playerList[0].name + "さんは置くマスを選んでください";
      } else {
        this.message = this.playerList[1].name + "さんは置くマスを選んでください";
      }
    },
    missPiece() {
      alert("コマを選んでください");
    },
    selectCircle(key, piece) {
      this.lastCircle = key;
      this.setBoardData(key, piece);
      // console.log(this.boardData);
      this.gameSituation = 1;
      this.pieceId = null;
      if (this.playerList[0].turn) {
        this.message = this.playerList[0].name + "さんは渡すコマを選んでください";
      } else {
        this.message = this.playerList[1].name + "さんは渡すコマを選んでください";
      }
    },
    selectPiece(index) {
      if (this.pieceId === index) {
        this.pieceId = null;
      } else {
        this.pieceId = index;
      }
    },
    judge() {
      return judgeResult(this.lastCircle, this.boardData);
    },
    async gameSet() {
      let now = this.playerList.findIndex(({ turn }) => turn === true);
      let enemy = now === 0 ? 1 : 0;
      this.gameSituation = 2;
      if (await this.judge()) {
          this.message = this.playerList[now].name + "さんの勝利です";
      } else {
          this.message = this.playerList[enemy].name + "さんの勝利です";
          for (let i in this.playerList) {
            this.playerList[i].turn = !this.playerList[i].turn;
          }
      }
    },
    resetGame () {
      this.gameSituation = 0;
      this.message = "STARTを押すとゲームが開始されます";
      for (let i in this.playerList) {
        this.playerList[i].turn = false;
      }
      this.pieceId = null;
      this.lastCircle = null;
    },
    async createBoardData() {
      for (let x in this.boardData) {
        this.boardData[x] = await ["", "", "", "",];
      }
      for (let x in this.boardData) {
        for (let y in this.boardData[x]) {
          this.boardData[x][y] = {
            color: "",
            shape: "",
            number: null,
            language: "",
          }
        }
      }
    },
    async setBoardData(key, piece) {
      let x = await Math.floor((Number(key) - 1) / 4);
      let y = await (Number(key) - 1) % 4;
      this.boardData[x][y].color = piece.color;
      this.boardData[x][y].shape = piece.shape;
      this.boardData[x][y].number = piece.number;
      this.boardData[x][y].language = piece.language;
    },
    // async test() {
    //   if (this.gameSituation === 1 && this.lastCircle !== null) {
    //     if (await this.judge()) {
    //       console.log("true");
    //     } else {
    //       console.log("false");
    //     }
    //   }
    // }
  },
};
</script>

<style scoped lang="scss">
.title {
    width: 100%;
    font-size: 32px;
    color: rgb(139, 91, 0);
    text-align: center;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.player {
  width: 304px;
  height: 32px;
  background: rgb(226, 226, 226);
  display: flex;
  align-items: center;
}

.left {
  justify-content: flex-end;
  border-radius: 16px 0px 0px 16px;
}

.right {
  justify-content: flex-start;
  border-radius: 0px 16px 16px 0px;
}

.turn-lamp {
  font-size: 20px;
  height: 30px;
  text-align: center;
}

.on {
  color: rgb(44, 197, 44);
}

.off {
  color: rgba(0, 0, 0, 0.6);
}

.message {
  width: 320px;
  text-align: center;
  white-space: pre-wrap;
  border-right: 4px solid silver;
  border-left: 4px solid silver;
  margin: 0px auto;
  margin-top: 8px;
}

.center {
  width: 100%;
  text-align: center;
  margin-top: 8px;
}

button {
  font-size: 20px;
  border-radius: 5%;
  margin: 0px 16px;
}

.transparent {
  opacity: 0.3;
}

.main {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 16px;
}

.board {
  width: 360px;
  height: 360px;
  background: rgba(233, 171, 55, 0.5);
  // border: 1px solid black;
  border-right: 8px solid rgba(77, 61, 11, 0.6);
  border-bottom: 8px solid rgba(77, 61, 11, 0.6);
  border-radius: 8px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.piece-desk {
  width: 224px;
  height: 360px;
  margin-left: 8px;
  &-small {
    width: 100%;
    height: 74px;
    background: rgb(240, 240, 240);
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    margin-top: 16px;
    padding: 2px;
  }
}
</style>