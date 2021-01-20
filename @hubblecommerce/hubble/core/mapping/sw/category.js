import {slugify} from '@hubblecommerce/hubble/core/utils/menuHelper';
import _ from 'lodash';

function categoryMapping(payload){
    let obj = {};

    // Map required properties from sw response to hubble requirements
    obj.id = payload.id;
    obj.name = payload.name;

    obj.description = payload.description;
    obj.teaser = payload.description;
    obj.meta_title = payload.metaTitle;
    obj.meta_keywords = payload.keywords;
    obj.meta_description = payload.metaDescription;
    obj.level = payload.level;

    if (payload.media !== null) {
        obj.image = payload.media.url;
    }

    // Keys to build path if not set
    obj.path_ids = [];
    obj.path_names = [];
    obj.path_urls = [];
    //if (payload.path != null) {
    //    let breadcrumbs = _.cloneDeep(payload.breadcrumb);
    //    breadcrumbs.shift();
    //    obj.path_names = breadcrumbs;
    //    obj.path_ids = breadcrumbs;
    //    obj.path_urls = [];
    //    _.each(obj.path_names, (crumb, index) => {
    //        let slugifiedCrumb = slugify(crumb) + '/';
    //        if (index > 1) {
    //            slugifiedCrumb = obj.path_urls[index - 1] + slugifiedCrumb;
    //        }
    //        obj.path_urls.push(slugifiedCrumb);
    //    });
    //}
    return obj;
}

export { categoryMapping };