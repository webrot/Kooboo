(function() {
  Kooboo.vue.component.kbFormItemSelection = Vue.component(
    "kb-form-item-selection",
    {
      props: {
        data: Object,
        name: String,
        options: Object,
        placeholder: String,
        ctx: Object
      },
      data() {
        return { finalOptions: [], fieldValue: "" };
      },
      watch: {
        data(data) {
          this.fieldValue = data[this.name];
        }
      },
      mixins: [window.fieldValidateMixin],
      mounted() {
        var self = this;
        if (this.options.default) {
          this.finalOptions.push({
            displayName: this.options.default.text,
            value: this.options.default.value
          });
        }

        if (this.options instanceof Array) {
          this.finalOptions = this.finalOptions.concat(this.options);
        } else if (this.options instanceof Object) {
          var self = this;
          this.finalOptions = this.finalOptions.concat(
            this.ctx[this.options.data].map(function(item) {
              return {
                displayName: self
                  .$parameterBinder()
                  .getValue(item, self.options.text),
                value: self
                  .$parameterBinder()
                  .getValue(item, self.options.value)
              };
            })
          );
        }
      },
      template: Kooboo.getTemplate(
        "/_Admin/Scripts/vue/components/kbForm/item/selection.html"
      )
    }
  );
})();
