<template>
  <input type="text" v-model="innerValue" />
</template>

<script>
export default {
    name: "TextField",
    props: {
        name: String,
        id: Number,
    },
    computed: {
        innerValue: {
            get() {
              return this.name;
            },
            set(value) {
              this.$emit("change-value", this.id, value);
            },
        },
    },
};
</script>

<style scoped>
input[type="text"] {
    font-size: 28px;
    width: 256px;
    height: 32px;
    background: rgba(226, 226, 226, 0.75);
    text-align: center;
    border: none;
    border-bottom: 1px dashed black;
    outline: none;
    margin: 0px 12px;
}
</style>