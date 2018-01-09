this.items = opts.options || [];

this.add = () => {
    this.items.push(this.refs.wish.value);
}
