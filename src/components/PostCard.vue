<template>
  <div class="row post">
    <q-card
      class="post__card shadow-up-1"
      :id="details.postNumber"
      data-test="post-card"
    >
      <div class="col-10">
        <q-list>
          <div class="row text-uppercase text-bold post__headline">
            <div class="col text-left">Departure</div>
            <div class="col text-right">Arrival</div>
          </div>

          <div class="row text-primary post__direction items-baseline">
            <div class="col post__left-details">
              <div
                class="text-h5 post__departure text-uppercase"
                data-test="post-departure-time"
              >
                <!-- {{ details.departureTime }} -->
              </div>
            </div>
            <div class="col post__right-details text-right">
              <div
                class="text-h5 post__arrival text-uppercase"
                data-test="post-arrival-time"
              >
                <!-- {{ details.arrivalTime }} -->
              </div>
            </div>
          </div>

          <div
            class="row text-primary post__timing"
            v-if="
              details.departureTime &&
              details.postDuration &&
              details.arrivalTime
            "
          >
            <q-separator class="post__separator" />
            <div class="col post__left-details">
              <div class="row inline">
                <q-icon class="post__icon-caption" name="post_takeoff" />
                <div
                  class="q-ml-sm text-body-1 text-bold q-pt-xs"
                  data-test="post-departure-code"
                >
                  <!-- {{ details.departureAirportCode }} -->
                </div>
              </div>
            </div>
            <div class="col post__center-details text-center">
              <div class="row inline">
                <q-icon class="post__icon-caption" name="access_time" />
                <div
                  class="q-ml-sm text-caption text-bold q-pt-xs"
                  data-test="post-duration"
                >
                  <!-- {{ details.postDuration }} -->
                </div>
              </div>
            </div>
            <div class="col post__right-details text-right">
              <div class="row inline">
                <q-icon class="post__icon-caption" name="post_land" />
                <div
                  class="q-ml-sm text-caption text-bold q-pt-xs"
                  data-test="post-arrival-code"
                >
                  <!-- {{ details.arrivalAirportCode }} -->
                </div>
              </div>
            </div>
          </div>

          <div
            class="row post__ticket items-baseline"
            v-if="!booking && details.ticketPrice && details.postNumber"
          >
            <q-separator class="post__separator" />
            <div
              class="col post__left-details text-grey-9"
              v-if="details.ticketPrice"
            >
              <div
                class="text-uppercase text-grey-9 post__price"
                data-test="post-price"
              >
                <span>&euro; {{ details.ticketPrice }}</span>
              </div>
            </div>
            <div class="col post__center-details"></div>
            <div
              class="col post__right-details text-right"
              v-if="details.postNumber"
            >
              <div class="row inline text-grey-9">
                <div class="text-caption capitalize text-bold">post</div>
                <div
                  class="q-ml-xs text-caption text-bold"
                  data-test="post-number"
                >
                  <!-- {{ details.postNumber }} -->
                </div>
              </div>
            </div>
          </div>
        </q-list>
      </div>
    </q-card>
  </div>
</template>

<script>

</script>

<style lang="sass" scoped>

.post
  margin: 1.3rem 1rem

.post__card
  min-width: 18rem
  max-width: 25rem
  margin: auto
  width: 100%
  &::after
    content: ''
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    opacity: 0
    box-shadow: 0 5px 15px rgba(0,0,0,0.3)
    transition: opacity 1s ease
  &:hover::after
    opacity: 1
    border-bottom: 1.5px solid $secondary

.post__arrival
  margin-left: 2.3rem

.post__separator
  background-color: $grey-3
  margin: 0.4rem
  width: 100%

.post__icon-caption
  font-size: 1.5rem

.q-list
  border: none
  color: #757575
  font-size: 14px
  font-weight: 500
  line-height: 18px
  min-height: 48px
  padding: 15px 16px

.post__headline
  color: #757575
  font-size: 0.8rem
</style>
