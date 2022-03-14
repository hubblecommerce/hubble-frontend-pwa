<template>
    <div class="contact-form">
        <h2>{{ title }}</h2>

        <form @submit.prevent="onSubmitForm">
            <div class="row">
                <div class="col-6">
                    <div class="hbl-input-group">
                        <input
                            id="mail"
                            v-model="formData.mail"
                            required
                            type="email"
                            name="mail"
                            placeholder=" "
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                        />
                        <label for="mail">Email address</label>
                    </div>

                    <div class="option">
                        <input id="privacyNewsletter" type="checkbox" name="privacyNewsletter" required />
                        <label for="privacyNewsletter">I have read the data protection information.</label>
                    </div>
                </div>
            </div>
            <button type="submit">Send</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'NewsletterForm',

    props: {
        title: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            formData: {
                mail: '',
            },
        };
    },

    methods: {
        onSubmitForm() {
            const formData = new FormData();

            Object.keys(this.formData).forEach((key) => {
                const val = this.formData[key];

                formData.append(key, val);

                // @ToDo: send to server
            });

            // for dev purpose only
            let outputString = 'ToDo: project specific form handling.\nForm data:\n\n';
            Object.keys(this.formData).forEach((key) => {
                const val = this.formData[key];

                outputString += `${key}: ${val}\n`;
            });
            alert(outputString);
        },
    },
};
</script>

<style lang="scss">
.contact-form {
    .hbl-select {
        margin: 0;
    }
}
</style>
