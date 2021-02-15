<template>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <h1>hubble Theme 2.0 Styleguide</h1>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="headline">Typography</div>
                <h1>Headline 1</h1>
                <h2>Headline 2</h2>
                <h3>Headline 3</h3>
                <h4>Headline 4</h4>
                <h5>Headline 5</h5>
                <h6>Headline 6</h6>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, <a class="link-primary" href="#">sed diam nonumy eirmod</a> tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="text-small">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, <a class="link-primary" href="#">sed diam nonumy eirmod</a> tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="headline">Buttons</div>
                <hbl-button>Button Default</hbl-button>
                <hbl-button class="button-primary">Button Primary</hbl-button>
                <hbl-button class="button-secondary">Button Secondary</hbl-button>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <hbl-button disabled>Button Default</hbl-button>
                <hbl-button disabled class="button-primary">Button Primary</hbl-button>
                <hbl-button disabled class="button-secondary">Button Secondary</hbl-button>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <hbl-button class="button-primary">
                    Button Primary
                    <svg-icon icon="chevron-left" />
                </hbl-button>

                <hbl-button class="button-secondary">
                    <svg-icon icon="x" />
                    Button Primary
                </hbl-button>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <hbl-button class="button-icon">
                    <span class="hidden-link-name">Button Default</span>
                    <svg-icon icon="x" />
                </hbl-button>
                <hbl-button class="button-icon">
                    <span class="hidden-link-name">Button Default</span>
                    <svg-icon icon="shopping-bag" />
                </hbl-button>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="headline">Forms</div>
            </div>
            <div class="col-md-4">
                <form>
                    <hbl-input class="input-icon">
                        <input id="input1" type="text" placeholder=" " required />
                        <label for="input1">Nachname*</label>
                        <svg-icon icon="x" />
                    </hbl-input>
                </form>
            </div>
            <div class="col-md-4">
                <form>
                    <hbl-input>
                        <input id="input2" type="text" placeholder=" " required />
                        <label for="input2">Nachname*</label>
                    </hbl-input>
                </form>
            </div>
            <div class="col-md-4">
                <hbl-input>
                    <input id="input4" type="text" placeholder=" " class="invalid" required />
                    <label for="input4" class="invalid">Invalid Input *</label>
                    <i class="icon icon-optional"></i>
                    <div class="validation-msg" v-text="'Not a valid email'" />
                </hbl-input>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <hbl-input>
                    <textarea id="input5" placeholder="Textarea" rows="4" cols="50" required />
                    <label for="input5">Invalid Input *</label>
                </hbl-input>
            </div>
        </div>

        <div class="row">
            <div class="col-md-4">
                <hbl-select>
                    <select class="select-text" required>
                        <option value="" disabled selected></option>
                        <option value="1">Option 1</option>
                        <option value="2">Option 2</option>
                        <option value="3">Option 3</option>
                    </select>
                    <label class="select-label">Select</label>
                </hbl-select>
            </div>
        </div>

        <div class="row">
            <div class="col-4">
                <hbl-checkbox>
                    <input id="checkboxId1" type="checkbox">
                    <label for="checkboxId1">Item 1</label>
                </hbl-checkbox>
            </div>

            <div class="col-4">
                <hbl-checkbox>
                    <input id="checkboxId2" type="checkbox" checked>
                    <label for="checkboxId2">Item 2</label>
                </hbl-checkbox>
            </div>
        </div>

        <div class="row">
            <div class="col-4">
                <hbl-checkbox>
                    <input id="radioId1" name="radio" type="radio">
                    <label for="radioId1">Item 1</label>
                </hbl-checkbox>
            </div>

            <div class="col-4">
                <hbl-checkbox>
                    <input id="radioId2" name="radio" type="radio" checked>
                    <label for="radioId2">Item 2</label>
                </hbl-checkbox>
            </div>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.container {
    max-width: 800px;
    padding-top: 20px;
    padding-bottom: 20px;
}

.row {
    margin-bottom: 40px;
}

.headline {
    font-size: 31px;
    line-height: 36px;
    margin-bottom: 40px;
}
</style>
