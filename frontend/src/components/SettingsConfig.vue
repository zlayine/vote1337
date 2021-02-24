<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <div class="settings" v-bind="attrs" v-on="on">
        <v-icon color="grey" large>fas fa-cog</v-icon>
      </div>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">App Config</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Label Text"
                v-model="data.times.Khouribga.lunch"
                type="time"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Label Text"
                v-model="data.times.Khouribga.dinner"
                type="time"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Label Text"
                v-model="data.times.Benguerir.lunch"
                type="time"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Label Text"
                v-model="data.times.Benguerir.dinner"
                type="time"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="number"
                label="Voting timespan"
								v-model="data.voting"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog"> Close </v-btn>
        <v-btn color="blue darken-1" dark @click="saveConfig">
          Save Config
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TimePicker from "./TimePicker.vue";

export default {
  data() {
    return {
      dialog: false,
      data: {
        times: {
          Khouribga: {
            lunch: "",
            dinner: "",
          },
          Benguerir: {
            lunch: "",
            dinner: "",
          },
        },
        voting: 0,
      },
    };
  },
  methods: {
    changeTime(data) {
      this.data.times[data.campus][data.meal] = data.time;
    },
    closeDialog() {
      this.dialog = false;
      this.data = this.config;
    },
    async saveConfig() {
      await this.$store.dispatch("updateConfig", this.data);
      this.dialog = false;
    },
  },
  mounted() {
    if (this.config) {
      this.data = this.config;
    }
  },
  computed: {
    config() {
      return this.$store.getters.config;
    },
  },
  components: {
    TimePicker,
  },
};
</script>

<style lang="scss" scoped>
.settings {
  margin: auto;
  margin-right: 20px;
  cursor: pointer;
}
</style>