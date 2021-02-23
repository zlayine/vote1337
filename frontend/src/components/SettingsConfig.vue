<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <div class="settings" v-bind="attrs" v-on="on">
        <v-icon color="grey" large>fas fa-cog</v-icon>
      </div>
    </template>
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <!-- <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="time"
                    label="Khouribga lunch"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu"
                  v-model="time"
									format="24hr"
                  full-width
                  @click:minute="$refs.menu.save(time)"
                ></v-time-picker>
              </v-menu> -->

              <time-picker @saveTime="changeTime">
                <template v-slot:abdo="{ attrs, on }">
                  <v-text-field
                    v-model="time"
                    label="Khouribga lunch"
                    v-bind="attrs"
                    v-on="on"
                    readonly
                  ></v-text-field>
                </template>
              </time-picker>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Khouribga dinner" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Benguerir dinner" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="Benguerir dinner" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field label="Benguerir dinner" required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false"> Save </v-btn>
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
      menu: false,
      time: null,
    };
  },
  methods: {
    changeTime(time) {
			this.time = time;
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