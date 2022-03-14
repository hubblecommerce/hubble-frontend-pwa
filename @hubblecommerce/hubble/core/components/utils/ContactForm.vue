<template>
    <div class="contact-form">
        <h2>{{ title }}</h2>

        <form @submit.prevent="onSubmitForm">
            <div class="row">
                <div class="col-4">
                    <div class="hbl-input-group">
                        <hbl-select>
                            <select id="salutation" v-model="formData.salutation" required class="select-text" name="salutation">
                                <option value="Mrs.">Mrs.</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Not specified">Not specified</option>
                            </select>
                            <label class="select-label" v-text="'Salutation'" />
                        </hbl-select>
                    </div>
                </div>
                <div class="col-4">
                    <div class="hbl-input-group">
                        <input id="firstname" v-model="formData.firstname" required type="text" name="firstname" placeholder=" " />
                        <label for="firstname">First name</label>
                    </div>
                </div>
                <div class="col-4">
                    <div class="hbl-input-group">
                        <input id="lastname" v-model="formData.lastname" required type="text" name="lastname" placeholder=" " />
                        <label for="lastname">Last name</label>
                    </div>
                </div>
            </div>
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
                </div>
                <div class="col-6">
                    <div class="hbl-input-group">
                        <input id="mail" v-model="formData.phone" type="text" name="phone" placeholder=" " />
                        <label for="phone">Phone number</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="hbl-input-group">
                        <input id="mail" v-model="formData.subject" required type="text" name="subject" placeholder=" " />
                        <label for="subject">Subject line</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="hbl-input-group">
                        <textarea id="mail" v-model="formData.message" required type="text" name="message" placeholder=" " />
                        <label for="message">Your message</label>
                    </div>

                    <div class="option">
                        <input id="privacyContact" type="checkbox" name="privacyContact" required />
                        <label for="privacyContact">I have read the data protection information.</label>
                    </div>
                </div>
            </div>

            <button type="submit">Send</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'ContactForm',

    props: {
        title: {
            type: String,
            default: '',
        },
        mailReceiver: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            formData: {
                salutation: '',
                firstname: '',
                lastname: '',
                mail: '',
                phone: '',
                subject: '',
                message: '',
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
