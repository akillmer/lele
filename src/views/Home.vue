<template>
  <div class="home">
    <router-link to="/"
      ><img class="brand" src="@/assets/lele-to.svg"
    /></router-link>
    <div class="layout">
      <div class="content">
        <h1>Short-links with aloha</h1>
        <p>
          Create your own short url and get access to analytics, all for free.
        </p>

        <h3>A for-fun project</h3>
        <p>
          My name's <a href="https://mixplate.io">Andy</a> and I created lele.to
          with Vue.js, Go, plus a few services from Google. Check all the code
          out at
          <a href="https://github.com/akillmer/lele-to">my GitHub repo</a>.
        </p>

        <h3>Looking for a full-stack developer?</h3>
        <p>
          Check out my portfolio at
          <a href="https://mixplate.io">mixplate.io</a>. Reach me by email at
          <a href="mailto:andy@mixplate.io">andy@mixplate.io</a>. Thanks!
        </p>

        <p class="social">
          <a href="https://github.com/akillmer/">
            <font-awesome-icon
              class="icon"
              :icon="['fab', 'github']"
            ></font-awesome-icon>
          </a>
          <a href="https://www.linkedin.com/in/akillmer/">
            <font-awesome-icon
              class="icon"
              :icon="['fab', 'linkedin-in']"
            ></font-awesome-icon>
          </a>
        </p>
      </div>

      <div v-if="urlKey !== null" class="content wizard">
        <span
          :class="{ 'lele-url copy-action': true, 'copied-anim': gotCopied }"
          @animationend="gotCopied = false"
          @click="copyText(`https://lele.to/${urlKey}`)"
          >https://lele.to/{{ urlKey }}</span
        >
        <font-awesome-icon
          v-if="gotCopied"
          class="fas fa-clipboard-check copy-icon"
          :icon="['fas', 'clipboard-check']"
        ></font-awesome-icon>
        <font-awesome-icon
          v-else
          class="far fa-copy copy-icon copy-action"
          :icon="['far', 'copy']"
          @click="copyText(`https://lele.to/${urlKey}`)"
        ></font-awesome-icon>
        <p>
          Visit
          <router-link :to="{ name: 'view', params: { urlKey } }"
            >https://lele.to/{{ urlKey }}/view</router-link
          >&nbsp;to see analytics, powered by Google.
        </p>
        <p>
          <router-link to="/">Click here</router-link>&nbsp;to make another
          short URL.
        </p>
      </div>

      <div v-else class="content wizard">
        <WizardStep title="Let's get started" :isActive="onStep(0)">
          <input
            v-model="clientURL"
            type="text"
            placeholder="Type or paste your URL"
            :disabled="!onStep(0)"
          />
          <ErrorMessage :hasError="!validURL">
            Make sure your URL is complete and starts with
            <strong>http://</strong> or
            <strong>https://</strong>
          </ErrorMessage>
        </WizardStep>

        <WizardStep
          title="Optionally, provide your email"
          :isActive="onStep(1)"
        >
          <p>
            In the future it may be possible to manage your short URLs. We will
            only use your email address to confirm ownership, promise!
          </p>
          <input
            v-model="clientEmail"
            type="text"
            placeholder="you@yourdomain.com"
            :disabled="!onStep(1)"
            @keyup="validateEmail"
          />
          <ErrorMessage :hasError="!validEmail"
            >Please double check your email.</ErrorMessage
          >
        </WizardStep>

        <WizardStep :isActive="onStep(2)" style="margin-bottom:2em;">
          <vue-recaptcha
            :loadRecaptchaScript="true"
            :sitekey="recaptchaKey"
            @verify="verifyHuman"
            @expired="expiredRecaptcha"
          ></vue-recaptcha>
        </WizardStep>

        <transition name="fade">
          <SurfingLoader :isActive="showLoader" />
        </transition>

        <ErrorMessage :hasError="apiError !== null" isFatal>
          This is embarrassing, please try again.
          <br />
          <pre>{{ apiError }}</pre>
        </ErrorMessage>

        <WizardStep :isActive="onStep(3)">
          <transition name="fade">
            <button v-if="!madeRequest" @click="submit" :disabled="!onStep(3)">
              Create my short URL
            </button>
          </transition>
        </WizardStep>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import './vars.scss';

.home {
  max-width: 1100px;
  margin: 80px auto;
  padding: 1em;

  .layout {
    display: flex;
  }

  .content {
    flex-basis: 0;
    flex-grow: 1;
    margin-top: 2em;
  }

  .wizard {
    flex-grow: 2;
    margin-left: 4em;
  }

  .lele-url {
    display: inline-block;
    font-size: 2.5em;
    font-weight: bold;
    background-color: #fafafa;
    padding: 0.25em;
    border-radius: 8px;
    margin-bottom: 0.5em;
  }

  .copy-icon {
    font-size: 2em;
    margin-left: 0.5em;
  }

  .copy-action {
    cursor: pointer;
  }

  .copied-anim {
    animation: bounce 0.5s;
    @keyframes bounce {
      0% {
        transform: scale(0.9);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  }

  img.brand {
    margin-bottom: 2em;
  }

  h1 {
    font-size: 1.5em;
    margin: 0;
  }

  h2 {
    margin: 0;
    margin-bottom: 0.5em;
  }

  h3 {
    font-size: 1.2em;
    margin-top: 2em;
    margin-bottom: 0;
  }

  p {
    margin: 0;
    margin-bottom: 1em;
  }

  .social {
    padding-top: 1em;

    .icon {
      font-size: 2em;
      color: $leleColor;
      margin-right: 1em;
    }
  }
}
</style>

<script>
import WizardStep from '@/components/WizardStep'
import SurfingLoader from '@/components/SurfingLoader'
import ErrorMessage from '@/components/ErrorMessage'
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'Home',
  components: { WizardStep, SurfingLoader, ErrorMessage, VueRecaptcha },
  data() {
    return {
      clientURL: '',
      clientEmail: '',
      validEmail: true,
      debounceID: null,
      recaptchaKey: '6LdB0MQUAAAAADac4GU4r2H9N19-HulWLTlOQdzY',
      recaptchaResponse: null,
      apiError: null,
      urlKey: null,
      madeRequest: false,
      gotCopied: false
    }
  },
  mounted() {
    document.title = 'Short-links with aloha — lele.to'
  },
  computed: {
    validURL() {
      const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
      let regex = new RegExp(expression)
      return regex.test(this.clientURL) === true
    },
    showLoader() {
      return this.madeRequest && this.apiError === null && this.urlKey === null
    }
  },
  methods: {
    validateEmail() {
      // validate the email input after debouncing
      if (this.debounceID !== null) {
        window.clearTimeout(this.debounceID)
      }
      if (this.clientEmail === '') {
        this.validEmail = true
        return
      }
      this.debounceID = window.setTimeout(() => {
        // providing an email is optional
        if (this.clientEmail === '') {
          this.validEmail = true
          return
        }
        const expression = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let regex = new RegExp(expression)
        this.validEmail = regex.test(this.clientEmail) === true
      }, 350)
    },
    verifyHuman(resp) {
      this.recaptchaResponse = resp
    },
    expiredRecaptcha() {
      this.recaptchaResponse = null
    },
    submit() {
      this.madeRequest = true

      this.$http
        .post(`/api/record/${this.recaptcha}`, {
          url: this.clientURL,
          owner: this.clientEmail
        })
        .then(resp => {
          this.urlKey = resp.data.key
        })
        .catch(err => {
          this.apiError = err
        })
    },
    onStep(step) {
      // no matter what if a short URL request has been made then all steps are inactive
      if (this.madeRequest) {
        return false
      }

      // any step before this one must be completed
      if (step > 0 && !this.onStep(step - 1)) {
        return false
      }

      // step #0, providing a URL, is always available
      if (step === 0) {
        return true
      }

      // step #1, email is optional
      if (step === 1 && this.validURL) {
        return true
      }

      // step #2, recaptcha is available if email is empty or present and valid
      if (step === 2 && this.validEmail) {
        return true
      }

      // step #3, request your tiny URL as long as recaptcha has a response
      if (step === 3 && this.recaptchaResponse !== null) {
        return true
      }

      return false
    },
    copyText(text) {
      const clipboard = document.createElement('textarea')
      clipboard.value = text
      document.body.appendChild(clipboard)
      clipboard.select()
      document.execCommand('copy')
      document.body.removeChild(clipboard)
      this.gotCopied = true
    }
  }
}
</script>
