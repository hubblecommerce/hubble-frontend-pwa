<template>
	<div class="flex-center position-ref full-height">
		<div class="content">
			<div class="error_code" v-text="errorCode"></div>
			<div class="error_message" v-text="errorMessage"></div>
			<nuxt-link to="/" class="btn btn-bar">step back</nuxt-link>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Error401',
	layout: 'error',

	data() {
		return {
			errorCode: 401,
			errorMessage: 'Authorization required.'
		}
	}
}
</script>