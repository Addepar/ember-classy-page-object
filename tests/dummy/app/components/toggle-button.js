import Component from '@ember/component';

export default Component.extend({
  activeClass: 'is-active',

  actions: {
    toggleActive() {
      this.toggleProperty('active');
    }
  }
});
