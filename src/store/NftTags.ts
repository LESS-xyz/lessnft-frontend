import { types } from 'mobx-state-tree';

const Tag = types.model({
  title: types.optional(types.string, ''),
  icon: types.optional(types.string, ''),
  image: types.optional(types.string, ''),
});

export const NftTags = types
  .model({
    tags: types.optional(types.array(Tag), []),
  })
  .views((self) => ({
    get getTags() {
      return self.tags;
    },
  }))
  .actions((self) => {
    const setTags = (tags: any) => {
      self.tags = tags;
    };

    return {
      setTags,
    };
  });
