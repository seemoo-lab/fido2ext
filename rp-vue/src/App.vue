<template>
  <h1>FIDO2 Greeter Extension</h1>

  <div>
    <input v-model="selectedExtInput" placeholder="greeter Message" :maxlength="31">

    <button @click="onRegister">MakeCredential with greeter</button>
  </div>

  <div v-if="receivedExtOutput !== null">
    <p>Received the following reponse: {{ receivedExtOutput }}</p>
  </div>
</template>

<script>
import { ref } from "vue";
import webautn from "@/helpers/webauthn";

export default {
  setup() {
    const selectedExtInput = ref("John");
    const receivedExtOutput = ref(null);

    const onRegister = async () => {
      console.log(
        "Calling make credential with greeter input: " +
          selectedExtInput.value
      );

      const resp = await webautn.createCredential({
        "greeter": selectedExtInput.value,
      });

      console.log("Received response:", resp);

      if (resp.credential)
        console.log(
          "Parsed response:",
          webautn.parseClientDataJson(resp.credential)
        );
	console.log("Ext: ", resp.credential.getClientExtensionResults());
    };

    return { selectedExtInput, receivedExtOutput, onRegister };
  },
};
</script>

<style scoped></style>
