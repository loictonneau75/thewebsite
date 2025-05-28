
# Site Configuration - [data.json](json/data.json)

The file [json/data.json](json/data.json) defines the dynamic structure of the web form used by the site, as well as the carousel configuration.

## Structure Overview

### Root Object

The file consists of a **root** `object` with the following **required** keys:
> ⚠️ All of the following keys are **mandatory**:

- [siteName](#sitename)
- [bgVideo](#bgVideo)
- [favicon](#favicon)
- [collectables](#collectables)
- [fields](#fields)
- [carousel](#carousel)

```js
{
    "siteName": str,
    "bgVideo": str,
    "collectables":{...},
    "field":[...],
    "carousel":{...}
}
```

### SiteName

A `string` used as the site name and page title.

### BgVideo

A `string` corresponding to the url of the video to use in background.

### Favicon

A `string` corresponding to the url of the favicon to use in background.
> you can convert a png in favicon with [favicon.io](https://favicon.io/)

### Collectables

An `object` that defines the name of the collected items in each supported [language](#languague).

```js
{
    ...,
    "collectables":{
        "en": str,
        "fr": str
    },
    ...
}
```

### Fields

An `array` of [rows](#row). Each [row](#row) represents a single line of inputs in the form.

```js
{
    ...,
    "fields":[
        {...},
        {...},
        {...}
    ],
    ...
}
// This form will have 3 rows
```

#### Row

A row is an `object` where each key represents an [input](#input). Each [input](#input) is itself an `object` defining a form field.


```js
{
    ...,
    "fields":[
        {
            "key1": {...},
            "key2": {...}
        },
        ...
    ],
    ...
}
// This row has two columns (two inputs)
```

#### input

##### Required keys
Each input must at minimum include the following keys:
> ⚠️ All of the following keys are **mandatory**:
- id
- required
- cardPositon
- label

|Key|Type|Description|
|-:|-|-|
|id|str|HTML ID of the input|
|required|bool|Is the input required?|
|cardPosition|str|Placement in the card: "header" or "body"|
|label|object|	Multilingual labels for the input (see [Language](#language))

```js
{
    ...,
    "fields":[
        {
            "key1": {
                "id": str,
                "required": bool,
                "cardPosition": str, // "header" or "body" 
                "label":{
                    "en": str,
                    "fr": str
                }
            },
            ...
        },
        ...
    ],
    ...
}
```
##### Optional keys

Additional properties allow you to control input behavior and appearance:

|Key|Type|Description|Constraint|
|-:|-|-|-|
|storageKey|str|Key used to store values in localStorage|None|
|otherId|str|Turns the input into a dropdown with a free text option|- **Mutually exclusive** with `choiceId` and `textarea`. <br>- Requires `storageKey`.|
|choiceId|str|Enables autocomplete with multi-choice support|- **Mutually exclusive** with `otherId` and `textarea`.<br> - Requires `storageKey`.|
|textarea|int|Converts the input into a multi-line textarea|**Mutually exclusive** with `choiceId` and `otherId`.|
|nbColumn|int|Adjusts layout by simulating (nbColumn - 1) extra inputs|None|
|cardRole|str|Defines appearance (title, subtitle)|Requires `cardPosition` set to `"header"`|
> ⚠️ You must use only **one** of `choiceId`, `otherId`, or `textarea` per input. They are not compatible with each other.


#####  Examples
1. With **storageKey** (standard input + localStorage):
    ```js
    {
        ...,
        "fields":[
            {
                "key1": {
                    "id": str,
                    "required": bool,
                    "cardPosition": str,
                    "storageKey":str,
                    "label":{
                        "en": str,
                        "fr": str
                    }
                },
                ...
            },
            ...
        ],
        ...
    }
    ```
2. With **otherId** (Dropdown with “Other” option):
    ```js
    {
        ...,
        "fields":[
            {
                "key1": {
                    "id": str,
                    "required": bool,
                    "cardPosition": str,
                    "storageKey":str,
                    "otherId":str,
                    "label":{
                        "en": str,
                        "fr": str
                    }
                },
                ...
            },
            ...
        ],
        ...
    }
    ```
3. With **choiceId** (Multi-choice input):
    ```js
    {
        ...,
        "fields":[
            {
                "key1": {
                    "id": str,
                    "required": bool,
                    "cardPosition": str,
                    "storageKey":str,
                    "choiceId":str,
                    "label":{
                        "en": str,
                        "fr": str
                    }
                },
                ...
            },
            ...
        ],
        ...
    }
    ```
4. With **textarea**:
    ```js
    {
        ...,
        "fields":[
            {
                "key1": {
                    "id": str,
                    "required": bool,
                    "cardPosition": str,
                    "textarea": int,
                    "label":{
                        "en": str,
                        "fr": str
                    }
                },
                ...
            },
            ...
        ],
        ...
    }
    ```
5. with **ndColumn** (Multi-column layout simulation):
    ```js
    {
        ...,
        "fields":[
            {
                "key1": {
                    "id": str,
                    "required": bool,
                    "cardPosition": str,
                    "nbColumn":int,
                    "label":{
                        "en": str,
                        "fr": str
                    }
                },
                ...
            },
            ...
        ],
        ...
    }
    ```
6. With **cardRole** (Card header roles title and subtitle):
    ```js
    {
        ...,
        "fields":[
            {
                "key1": {
                    "id": str,
                    "required": bool,
                    "cardPosition": "header",
                    "cardRole": "title"
                    "label":{
                        "en": str,
                        "fr": str
                    }
                },
                "key2": {
                    "id": str,
                    "required": bool,
                    "cardPosition": "header",
                    "cardRole": "subtitle",
                    "label":{
                        "en": str,
                        "fr": str
                    }
                }
                ...
            },
            ...
        ],
        ...
    }
    ```

### Carousel

An `object` describing visual carousel behavior:

|Name|Type|Description|
|-:|-|-|
|slidesToScroll|int|Number of slides to scroll per button click|
|slidesVisible|int|Number of slides shown at once|
|loop|bool|Enables looping behavior(do not combine with infinite)|
|infinite|bool|Enables infinite scroll (do not combine with loop)|
|slideIndicator|bool|Show pagination indicator|

> ⚠️ You cannot set both **loop** and **infinite** to **true** simultaneously.

```js
{
    ...,
    "carousel":{
        "slidesToScroll": int,
        "slidesVisible": int,
        "loop": bool,
        "infinite": bool,
        "slideIndicator": bool
    }
}
```

### Language

To add a new language, update the following:
#### In [data.json](json/data.json)
- Add translations in:
    - [collectables](#collectables)
    - [input.label](#input)

#### In [label.json](json/label.json)
- Add a new language `object` following the structure of existing ones
- Translate all keys
- Include a flag key with the path to your new flag icon (e.g., img/flag/es.svg)
> You can find svgs for flag here : [flag-icon](https://flagicons.lipis.dev/)

## SCSS Compilation
This project uses **SCSS** (Sass) for styling, compiled with **Dart Sass**. The `.scss` files are automatically transformed into `.css` using a watch script.

### Why might the CSS be missing after cloning?
If you clone this repository from GitHub, it's possible that the `.css` file is missing or outdated. This is because the CSS is generated locally from the SCSS files and may not be versioned to avoid unnecessary conflicts or redundant code.

### How to generate the CSS?
You need to run the appropriate SCSS watch script based on your operating system:
- **On Windows:**
    ```bash
    ./watch.bat
- **On macOS / Linux:**
    ```bash
    ./watch.sh
If `./watch.sh` doesn't execute, you may need to make it executable first:
```bash
chmod +x /path/to/watch.sh
```

These scripts use Dart Sass to compile SCSS files into CSS in real time whenever a change is detected.

### Requirements
Make sure you have Dart Sass installed on your machine. You can install it via:
- npm (universal method):
    ```bash
    npm install -g sass
    ```
- or follow the official installation guide: [sass-lang.com/install](https://sass-lang.com/install)

Once Dart Sass is installed and the watch script is running, any changes made to `.scss` files will automatically be compiled into `.css`.

# Style Customization - [custom.scss](scss/custom.scss)
The file [scss/_const.scss](scss/custom.scss) contains global SCSS variables used to customize the appearance and styling of the entire site.

## Font

### Add a Font
>⚠️ All font imports (external or local) **must be placed at the top** of the file

#### Add a new font by API

1. Choose a font from [Google Fonts](https://fonts.google.com).
2. Copy the provided `@import statement`.
3. Paste it at the top of [custom.scss](scss/custom.scss).

###### exemple

```scss
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
```
#### Add a new font in local

1. Place your font file (e.g., .woff2, .ttf) in the`font/` folder
2. Declare it using `@font-face` in [custom.scss](scss/custom.scss)

|Name|Description|Constraint|
|-|-|-|
|font-family|Name used to reference the font in CSS|- **required**<br>- Must be unique|
|src|Path or URL to the font file|- **required**|
|format|Specifies the font format|- **required**<br>- Must match the actual file format (truetype, opentype, woff, etc...)|
|font-weight|Defines the weight (thickness) of the font|Use `normal`, `bold`, or `numeric` (`400`, `700`, etc.)|
|font-style|Defines the font style|Use `normal`, `italic`, or `oblique`|

###### exemple

```scss
@font-face {
    font-family: 'MyFont';
    src: url('./fonts/myfont.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}
```

### Apply the Font

The project uses two global font variables:
```scss
    $title-font: str;
    $body-font: str;
```
Use the `font-family` value declared in your import or `@font-face` as the value for these variables.

These variables are used throughout the site to apply consistent typography styles to titles and body text.

## color

Colors are stored in a SCSS map variable called `$colors`, with named keys for different usage types
```scss
$colors : (
    "primary":   #AEB89F,
    "secondary": #4B6653,
    "error":     #e84141
);

```

### Change a Color

To change the site’s color theme, simply **edit one or more values** in this map.
All elements using these colors will automatically update when the SCSS is recompiled.

