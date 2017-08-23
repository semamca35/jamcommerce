import _ from 'lodash';
import { createAction, combineActions, handleActions } from 'redux-actions';
import { createTypes } from 'redux-create-types';
import { createSelector } from 'reselect';

import imageMenu from '../image-menu.png';

const ns = 'nav';

const types = createTypes(
  [
    'clickOnSubNav',
    'hoverOnSubNav',
    'mouseLeaveMenu',
  ],
  ns,
);

const womansLink = '/womans';
const initialState = {
  isMenuOpen: false,
  currentDirectory: 'New Arrivals',
  directories: [
    'New Arrivals',
    'Womans',
    'Mens',
    'Collections',
  ],
  directoriesById: {
    'New Arrivals': {
      title: 'New Arrivals',
      href: womansLink,
      view: 'Image',
      categories: [
        'Women',
        'Men',
      ],
    },
    Womans: {
      title: 'Womans',
      href: womansLink,
      view: 'Text',
      categories: [
        'Clothing',
        'Accessories',
      ],
    },
    Mens: {
      title: 'Mens',
      href: womansLink,
      view: 'Text',
      categories: [
        'Clothing',
        'Accessories',
      ],
    },
    Collections: {
      title: 'Collections',
      href: womansLink,
      view: 'Image',
      categories: [
        'Summer Colors',
        'Essential Handbags',
      ],
    },
  },
  categoriesById: {
    Women: {
      title: 'Woman',
      img: imageMenu,
    },
    Men: {
      title: 'Men',
      img: imageMenu,
    },
    'Summer Colors': {
      title: 'Summer Colors',
      img: imageMenu,
    },
    'Essential Handbags': {
      title: 'Essential Handbags',
      img: imageMenu,
    },
    Clothing: {
      title: 'Clothing',
      sub: [
        'Active Wear',
        'Beach & Sun',
        'Blazers',
        'Coats & Blazers',
        'Demin',
        'Dresses',
        'Pajamas',
        'Pants & Leggings',
        'Shirts',
        'Skirts',
        'Sleep & Lounge',
        'Tees & Tops',
      ],
    },
    Accessories: {
      title: 'Accessories',
      sub: [
        'Bags',
        'Belts',
        'Handbags & Wallets',
        'Hats & Hair Accessories',
        'Jewelry',
        'Luggage & Travel',
        'Scarves & Wraps',
        'Shoes & Sandels',
        'Sunglasses',
        'Watches',
      ],
    },
  },
  subById: {
    'Active Wear': { title: 'Active Wear', href: 'womensLink' },
    Bags: { title: 'Bags', href: 'womensLink' },
    'Beach & Sun': { title: 'Beach & Sun', href: 'womensLink' },
    Belts: { title: 'Belts', href: 'womensLink' },
    Blazers: { title: 'Blazers', href: 'womensLink' },
    'Coats & Blazers': { title: 'Coats & Blazers', href: 'womensLink' },
    Demin: { title: 'Demin', href: 'womensLink' },
    Dresses: { title: 'Dresses', href: 'womensLink' },
    'Handbags & Wallets': { title: 'Handbags & Wallets', href: 'womensLink' },
    'Hats & Hair Accessories': {
      title: 'Hats & Hair Accessories',
      href: 'womensLink',
    },
    Jewelry: { title: 'Jewelry', href: 'womensLink' },
    'Luggage & Travel': { title: 'Luggage & Travel', href: 'womensLink' },
    Pajamas: { title: 'Pajamas', href: 'womensLink' },
    'Pants & Leggings': { title: 'Pants & Leggings', href: 'womensLink' },
    'Scarves & Wraps': { title: 'Scarves & Wraps', href: 'womensLink' },
    Shirts: { title: 'Shirts', href: 'womensLink' },
    'Shoes & Sandels': { title: 'Shoes & Sandels', href: 'womensLink' },
    Skirts: { title: 'Skirts', href: 'womensLink' },
    'Sleep & Lounge': { title: 'Sleep & Lounge', href: 'womensLink' },
    Sunglasses: { title: 'Sunglasses', href: 'womensLink' },
    'Tees & Tops': { title: 'Tees & Tops', href: 'womensLink' },
    Watches: { title: 'Watches', href: 'womensLink' },
  },
};

export const clickOnSubNav = createAction(types.clickOnSubNav);
export const hoverOnSubNav = createAction(types.hoverOnSubNav);
export const mouseLeaveMenu = createAction(types.mouseLeaveMenu, _.noop);

export const getNS = state => state[ns];

export const isMenuOpenSelector = state => getNS(state).isMenuOpen;

export const subByIdSelector = state => getNS(state).subById;
export const currentDirectorySelector = state => getNS(state).currentDirectory;
export const directoriesByIdSelector = state => getNS(state).directoriesById;

export const directoriesSelector = createSelector(
  directoriesByIdSelector,
  state => getNS(state).directories,
  (table, ids) => ids.map(id => table[id] || {}),
);
export const directorySelector = createSelector(
  directoriesByIdSelector,
  currentDirectorySelector,
  (table, id) => table[id] || {},
);

export const categoriesByIdSelector = state => getNS(state).categoriesById;
export const categoriesSelector = createSelector(
  directorySelector,
  categoriesByIdSelector,
  subByIdSelector,
  ({ categories = [] }, categoryById, subById) =>
    categories.map(id => categoryById[id] || {}).map(category => {
      if (!Array.isArray(category.sub)) {
        return category;
      }
      return {
        ...category,
        sub: category.sub.map(id => subById[id]),
      };
    }),
);

export default function createReducer() {
  const reducer = handleActions(
    {
      [combineActions(types.clickOnSubNav, types.hoverOnSubNav)]: (
        state,
        { payload: item },
      ) => ({
        ...state,
        isMenuOpen: true,
        currentDirectory: item,
      }),
      [types.mouseLeaveMenu]: state => ({
        ...state,
        isMenuOpen: false,
      }),
    },
    initialState,
  );
  reducer.toString = () => ns;
  return reducer;
}
