<template>
  <div class="meal-filter">
    <div class="date-filter">
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="dates"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="dateRangeText"
            label="Date filter"
            class="date-input"
            prepend-icon="mdi-calendar"
            readonly
            hide-details
            clearable
            @click:clear="clearDate"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="dates" range color="primary" :max="currentDate">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
          <v-btn text color="primary" @click="dateChange"> OK </v-btn>
        </v-date-picker>
      </v-dialog>
    </div>
    <div class="campus-filter" v-if="user && user.staff">
      <v-btn-toggle
        v-model="campus"
        class="actions"
        mandatory
        color="primary"
        @change="campusChange"
        tile
        borderless
      >
        <v-btn value="Khouribga">
          <span class="">Khouribga</span>
        </v-btn>

        <v-btn value="Benguerir">
          <span class="">Ben-guerir</span>
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      campus: "",
      dates: [],
      modal: false,
    };
  },
  methods: {
    campusChange() {
      this.$emit("changeCampus", { page: 1, campus: this.campus });
      let old = this.campus == "Khouribga" ? "Benguerir" : "Khouribga";
      this.$store.commit("EMIT_CHANGE_CAMPUS", { old: old, new: this.campus });
    },
    clearDate() {
      this.$emit("changeDate", {
        page: 1,
        campus: this.campus,
        date: [],
      });
    },
    dateChange() {
      if (this.dates.length == 2) {
        this.$refs.dialog.save(this.dates);
        this.$emit("changeDate", {
          page: 1,
          campus: this.campus,
          date: this.dates,
        });
      } else {
        this.$store.commit("SET_NOTIFICATION", {
          msg: "Please select a range date",
          error: 1,
        });
      }
    },
  },
  mounted() {
    if (this.currentUser) this.campus = this.currentUser.campus;
  },
  computed: {
    currentDate() {
      return moment().format("YYYY-MM-DD");
    },
    dateRangeText: {
      get() {
        return this.dates.join(" ~ ");
      },
      set() {
        return "";
      },
    },
    user() {
      return this.$store.getters.user;
    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
};
</script>

<style lang="scss" scoped>
.meal-filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;

  .campus-filter {
    margin-top: 10px;
    .actions {
      border-radius: 5px;
      button span {
        font-weight: 500;
      }
    }
  }

  .date-filter {
    .date-input {
      width: 250px;
    }
  }
}

@media (max-width: 768px) {
  .meal-filter {
    flex-direction: column-reverse;
    align-items: center;
    padding: 10px;

    .campus-filter {
      margin-bottom: 10px;
    }
  }
}
</style>