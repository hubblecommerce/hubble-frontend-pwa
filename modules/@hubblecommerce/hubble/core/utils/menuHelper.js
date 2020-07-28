import _ from 'lodash';

/**
 * Helper Function to sort menu entries and their children alphabetically
 *
 * @param children
 * @returns {unknown[]}
 */
function sortMenuEntries(children) {
    let currentEntries = children;
    currentEntries = _.sortBy(currentEntries, [item => item.name.toLowerCase()]);
    _.forEach(currentEntries, category => {
        if (!_.isEmpty(category.children)) {
            category.children = sortMenuEntries(category.children);
        }
    });
    return currentEntries;
}

/**
 * Helper Function to convert strings to seo-friendly urls
 *
 * @param string
 * @returns String
 */
function slugify(string) {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-') // Replace & with '-'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Helper Function to turn a flat array to an associative by parentId
 * parentId of first level item in array needs parentId = 0
 *
 * @param array
 * @returns Array
 */
function unflatten(array, parent, tree) {
    tree = typeof tree !== 'undefined' ? tree : [];
    parent = typeof parent !== 'undefined' ? parent : { id: 0 };

    let children = _.filter(array, function (child) {
        return child.parentId == parent.id;
    });

    if (!_.isEmpty(children)) {
        if (parent.id == 0) {
            tree = children;
        } else {
            parent['children'] = children;
        }
        _.each(children, function (child) {
            unflatten(array, child);
        });
    }

    return tree;
}

function findCategoryByUrl(tree, path) {
    let matchingCategory = false;

    _.each(tree, category => {
        if (category.url_path === path) {
            matchingCategory = category;
        }
        if (!_.isEmpty(category.children)) {
            let temp = findCategoryByUrl(category.children, path);
            if (!_.isEmpty(temp)) {
                matchingCategory = temp;
            }
        }
    });

    return matchingCategory;
}

function findProductByUrl(tree, path) {
    let matchingUrl = false;

    _.each(tree, url => {
        if (url.seoPathInfo === path) {
            matchingUrl = url;
        }
    });

    return matchingUrl;
}

export { sortMenuEntries, slugify, unflatten, findCategoryByUrl, findProductByUrl };
