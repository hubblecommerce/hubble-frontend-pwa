# File-based inheritance

## Concept
To keep hubble PWA updatable but also customizable it provides an inheritance mechanism only based on file paths. As a 
basis, hubble sets the [nuxt srcDir](https://v3.nuxtjs.org/api/configuration/nuxt-config#srcdir) to _/.hubble_.

On every application build hubble PWA:
1. creates a .hubble directory in the projects root directory if not already exists 

<img src="/assets/images/file_based_inheritance-1@2x.jpg" alt="hubble PWA File-based inheritance Concept Step 1" style="width: 100%;" />

2. takes all hubble theme files from _node_modules/@hubblecommerce/hubble/dist/theme_ and places them into _.hubble_

3. takes all platform specific composables (based on .env PLATFORM) from 
_node_modules/@hubblecommerce/hubble/dist/platforms/[PLATFORM]/composables_ and places them into _.hubble_

4. takes all nuxt related directories (except for: node_modules, .hubble, .nuxt, .idea) from the project root path and
   copy them into _.hubble_. Files that already exists will be overwritten.

<img src="/assets/images/file_based_inheritance-3@2x.jpg" alt="hubble PWA File-based inheritance Concept Step 3" style="width: 100%;" />

## Overwriting files
To customize a specific component provided by hubble PWA you just have to:
1. find the component or file you want to edit in 
_node_modules/@hubblecommerce/hubble/dist/theme_ or _node_modules/@hubblecommerce/hubble/dist/platforms/[PLATFORM]/composables_
2. copy the file to your projects root directory, make sure the path stays the same 

```
cp node_modules/@hubblecommerce/hubble/dist/theme/components/layout/LayoutHeader.vue components/layout/LayoutHeader.vue
```

3. customize the file just created
4. rebuild the application

## .hubble Directory
Never customize files directly inside .hubble or the changes will be overwritten on next application build. 
There is no need for this directory to be versioned, so don't forget to add it to your .gitignore. 

## Path aliases
hubble PWA automatically sets the [default aliases](https://v3.nuxtjs.org/api/configuration/nuxt-config#alias)
to the new nuxt root directory, so you can use them just as in a regular nuxt project.
