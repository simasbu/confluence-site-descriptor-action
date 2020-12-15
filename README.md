<p align="center">
  <a href="https://github.com/simasbu/confluence-site-descriptor/actions"><img alt="typescript-action status" src="https://github.com/simasbu/confluence-site-descriptor/workflows/build-test/badge.svg"></a>
</p>

## Description

A github action that builds `site.yaml` which can be used to deploy pages using [bsorrentino/maven-confluence-plugin](https://github.com/bsorrentino/maven-confluence-plugin)

## Usage

Use the folowing code in the workflow:

```bash
- name: Generate site.yaml
  uses: simasbu/confluence-site-descriptor@main
  with:
    localDirectory: "confluence"
    parentPageTitle: "Home"
    homePageTitle: "Hello world"
    spaceKey: "SPACE"
```

The `action.yml` contains definitions of the inputs and output for the action.

Each directory must:

- have a `README.md` file
- not contain empty spaces in the name

Directory name will become a page name on confluence. Use underscores in places where you want to have spaces. E.g.:

| Folder name | Resulted page name |
| ----------- | :----------------: |
| My Product  |  _Name not valid_  |
| My_Product  |     My Product     |

### File structure

`./`  
`├── confluence/`  
`| ├── README.md`  
`| ├── My_Product/`  
`│ | ├── README.md`  
`| └── My_Team/`  
`│ | ├── README.md`

Following

## Code in Main

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  __tests__/main.test.ts
  ✓ success flow (81ms)
...
```
