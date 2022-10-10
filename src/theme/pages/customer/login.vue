<template>
    <div class="container lg:max-w-xl m-auto p-6 my-6 flex flex-col">
        <div class="flex flex-col gap-4 p-8 shadow-xl">
            <div class="text-2xl text-center">
                Login to your account
            </div>
            <CustomerLoginForm />
        </div>
        <div class="flex flex-col gap-4 p-8">
            <div class="text-2xl text-center">
                Don't have an account?
            </div>

            <MiscLink to="/customer/register" class="btn btn-secondary">
                Create a new account
            </MiscLink>
        </div>
    </div>
</template>

<script setup></script>
