# Information Visualization

## Justification

### Definition of InfoVis

> InfoVis is the use of computer-supported, interactive, visual representations of abstract data to amplify cognition.

### Why have a Human in the loop?

Many analysis problems are _ill specified_

The scope of what people are willing and able to do manually is strongly limited by their attention span.

### Why have a computer in the loop?

Can do computations much faster and process extremely large datasets

### Why use an external representation?

External representations augment human capacity by improving our internal cognition and memory through processing/visualization

### Why use interactivity?

We cannot visualize all the dimensions of data in a single view, because the screen space is limited.

We allow users to interactively choose what they want to see.

In some definitions, interactivity is necessary for __InfoVis__.

### Why are most designs ineffective?

The vast majority of the possibilities in the design space are will be ineffective

Only a very small number of possibilities are in the set of reasonable choices, and only an even smaller fraction are excellent choices.

### Why are there Resource Limitations?

- Computational Capacity

- Human perceptual and cognitive capacity

- Display capacity

## How to Implement a Vis

### Top-down vs. Bottom-up

Top-down:

- choose a chart type and map attributes to templated placeholders

Bottom-up:          <- well aligned with vis research

- choose a mark type and visual channel for an attribute to visualize

## Data Abstraction

### Why Data Semantics and Types?

__type__:

- structural or mathematical interpretation

__semantic__:

- real-world meaning

### Data, Dataset and Attributes

Data Type:

- what kind of thing is the data?

Dataset Type:

- how are these data types combined into a larger structure?

Attribute Types:

- what kind of mathematical operations are meaningful?

### Data Types

- Items
- Attributes
- Links
- Positions
- Grids

#### Item

Individual entity that is discrete

#### Attribute

Specific property that can be measured, observed or logged

#### Link

Relationship between items (typically within a network)

#### Grid

Strategy for sampling continuous data in terms of:

- geometric
- topological

relationship between its cells

#### Position

Spatial data, providing location in 2D or 3D space

### Dataset Types

#### Table

- Items

- Attributes

One of the most common dataset types

Includes __items__ (rows) and __attributes__ (columns)

A cell is specified by the combination of a row and a column

#### Networks/Tress

- Items
- Links
- Attributes

Includes __items__ (nodes), __links__ (links) and __attributes__ (relationship between 2 or more nodes)

#### Fields

- Grids

    - Positions

- Attributes

Includes __attribute__ values associated with cells.

Measurements come from __continuous__ data

Since it is impossible to measure an infinite number of cells, _sampling_ and _interpolation_ techniques are important in the field dataset type

Sampling:

- How frequently to take the measurements

Interpolation:

- How to show values between the sampled points

#### Geometry

- Items

- Positions

Specifies information about the shape of items with explicit spatial positions

#### Clusters, Sets & Lists

- Items

Set

- an _unordered_ group of items

List

- an _ordered_ group of items

Cluster

- grouping based on attribute similarity

### Attribute Types

__Categorical__ data does not have an implicit ordering

- may contain hierarchy structure

- ex.: movie genres, file types, etc.

- supports __=__ and __!=__

__Ordered__ data has an implicit ordering

- __Ordinal__ data has an ordering but arithmetic is not meaningful (ex.: shirt sizes, ranks)

- __Quantitative__ data has ordering and arithmetic operations

#### Quantitative data can be

- __interval__ data:
    * distances are meaningful but there is no absolute zero

- __ratio__ data:
    * distances are meaningful and there is an absolute zero

#### For ordered data, there is ordering direction

- __Sequential__:

    - there is an homogeneous range from a minimum to a maximum (ex.: height)

- __Diverging__:

    - data can be separeted in 2 sequences pointing in separete directions that meet at a common point (ex.: elevation)

- __Cyclic__:

    - the values wrap around back to the starting point (ex.: day of the week)

### Semantics

Key:

- Acts as an index to look up __value__ attributes

For multidimensional tables (or fields), multiple keys are required to look up an item

## Task Abstraction

> Consider tasks in an __abstract form__, rather than __domain-specific way__

### Actions

#### High-Level Choice: Analyze

What are possible goals of users who want to analyze data using a vis tool?

- Consume:
    - the most common case for vis is for the user consume information as data

- Produce:
    - sometimes, vis is used to produce new information

##### Consume [Analyze]

- Discover
    - find new knowledge that was not previously known

- Present
    - communicate with others about the knowledge that is known

- Enjoy
    - visualization in casual encounters

##### Produce [Analyze]

The intent is to generate new material:

- Annotate
    - adding graphical or textual annotations associated with one or more elements

- Record
    - saving or capturing visualization elements as __persistent__ data

- Derive
    - producing new data elements from existing data

#### Mid-Level Choice: Search

All high-level analyze cases require users to __search__ for elements of interest

Can be classified into 4 types

|   | Target Known | Target Unkown |
|---|---|---|
| Location Known | LOOKUP | BROWSE |
| Location Unkown | LOCATE | EXPLORE |

#### Low-Level Choice: Query

After searching, you will find a target
For that, you may __query__ some informtion

- Identify
    - returns the characteristics of a _single_ target

- Compare
    - returns the characteristics of _multiple_ targets

- Summarie
    - returns a comprehensive list of _everything_

### Targets

Targets means some data that is of __interest__ to the user

#### All-Data Level

- Trends
    - a high-level characterization of data

- Outliers
    - elements that do not fit well with trends

- Features
    - particular structures of interest

#### Attribute Level

- Distribution

- Extremes

- Dependency

- Correlation

- Similarity

#### Network Data

- Topology

- Paths

#### Spatial Data

- Shape

## Marks and Channels

Visual encoding can be broken down into 2 components:

- Marks

    - basic geometric elements that depict items or links

- Channels

    - control the appearance of marks to convey data

Example:

> Bar Chart:
MARK: Line or Rectangle
CHANNELS:
    y: quantitative attribute
    x: categorical attribute

### Marks

Basic graphical element in an image

- 0D: point
- 1D: line
- 2D: area
- 3D: volume

### Channels

Way to control the appearance of marks

- Position

    - Horizontal

    - Vertical

    - Both

- Shape

- Size

    - Length

    - Area

    - Volume

### Mark Types

You can use multiple channels to encode more data (x, y, color, size, etc...)

- Magnitude Channels (good for ordered data)

    - _how_ much of something there is

- Identity Channels (good for categorical data)

    - _what_ something is or _where_ it is

### Expressiveness and Effectiveness

Expressiveness principle

    - visual encodings should express all of, and only, the information in the dataset attributes

Effectiveness principle

    - the importance of the attributes should match the __salience__ of the channel

#### Steven's Power Law

> a channel with _n_ close to 1 can be considered effective

#### Discriminability and Separability

Discriminability: are the differences perceptible?

Separability: how accurately can people access information encoded by each channel?
    
    - if the goal is to show 2 different data attributes, use _seperable_ channels

#### Visual Popout

Visual popout happens for a __single__ visual channel

Visual popout is not possible for 3 or more channels

#### Grouping

The easiest way to show visual elements as groups is just to connect the elements

Gestalt laws tell how humans naturally perceive objects as organized patterns and objects

- Proximity

- Similarity

- Connectedness

- Continuity

- Symmetry

## Colors (Perception)

__Why color?__

> Color supports preattentive processing

### Trichromacy

The spectrum of light is reduced as three values

- S (short): BLUE

- M (medium): GREEN

- L (long): RED

### CIEXYZ Color Space

Internation Standard for color specification
    - created because of the need for non-negative values in all human visible colors

#### Gamut

Gamut or color gamut is a set of colors that can be reproduced by mixing the given primaries

### HSL Color Space

- Hue: what color

- Saturation: the amount of white mixed in

- Lightness: the amount of black mixed in

> It does not truly reflect how we perceive color. It is pseudoconceptual

### L\*a\*b\* Color Space

Calibrates the limitations of HSL

- L\*: perceptual lightness

- a\*: green-red

- b\*: blue-yellow

> a\* and b\* were chosen based on the opponent color model of human vision

## Colors (Encoding)

### Terminology

- Luminance: the measured amount of (physical) light

- Brightness: the perceived amount of light

- Lightness: perceived reflectance of a surface

#### Brightness vs. Lightness

__Brightness__ is used when talking about things that are _self-luminous_

It follows Steven's Power Law

> Perceived Brightness == Luminance

__Lightness__ is important in vis. It is the perceived reflectance of a surface

In both the HSL and CIELAB color spaces, L means Lightness, __not__ Luminance

### Color Encoding

- Hue for nominal data

- Luminance or Saturation for ordinal or quantitative data

> Hue does not have an implicit perceptual ordering

#### Luminance/Saturation for Ordinal/Quantitative

Luminance

- use less than 5 bins when background is not uniform

Saturation

- the number of discriminable bins is low (~3)

#### Transparency

Encoding data in transparency is not a good idea because it directly affects Luminance and Saturation

### Colormaps

#### Neutral values

If there are neutral values in the data, use __diverging colomaps__

Use a different hue for each side

#### Sequential values

For sequential data, use Sequential colormaps

Luminance channel is good for ordered data

#### Categorical Colormaps

If there are more than 2 categories, we need to use __hue__

Consider luminance

- it is not a good idea to use yellow against a black background

Consider mark type

- colors for small regions should be highly saturated

## Arrange Tables

### Size Channel

- Length

    - 1-dimensional size

- Area

    - less accurate than length

    - width and height have interference

- Volume

    - Inaccurate

### Orientation Channel

encode magnitude information based on the orientation of a mark

### Why arrange?

__Arrange__ means the use of spatial channels for visual encoding

## Arrange Networks

### 2 Families of Visualization

- Node-link diagram

    - Uses the connection channels

- Adjacency Matrix

### Node-link Diagram

Nodes are drawn as point marks and the links connecting them are drawn as line marks

#### Radial Layout

The distance away from the center shows __depth__

Vertical and horizontal positions are chosen by a layout algorithm to avoid overlap

### Scalability

We need to aggregate edges for bigger trees

## Validation

### Vis Design

Problems

- You cannot answer "why is yours effective?"

- You cannot answer "why is yours better than other designs?"

- You cannot evaluate your vis quantitatively nor qualitatively

Why this happened?

> Because you didn't define the problem to solve vis

### Split the design process into four cascading levels

- Domain Situation

- Data/Task Abstraction

- Visual Encoding/Interaction Idiom

- Algorithm

#### Domain Situation

You consider details of a particular application domain for vis

#### What-Why Abstraction

You map those domain-specific problems and data into forms that are independent of the domain

Questions

- What are the datasets types?

- What are the attributes types?

#### How Abstraction

You design idioms that specify the approach to visual encoding and interaction

_Idioms_: vis and interaction techniques (bar chart, scatterplot)

#### Algorithm Implementation

You design and implement the algorithms

_Questions_

- What algorithms should be used for implementation

- Into what components should the system be modularized into

### Block

A block is the outcome of the design process at one level

The output from an upstream level is input to the downstream level

Choosing the wrong black at one level cascades down to all lower blocks

> SOLUTION: use iterative design

### Task and Data Abstraction

Goal

- Identify task blocks and design data blocks

Identify task blocks

- Abstract domain-specific vocabulary into the domain-independent vocabulary

- Abstract tasks (browsing, summarizing, etc.)

Design data blocks

- Design data blocks, dont just select them

- Choose the right form for data and transformation between them

### Visual Encoding and Interaction Idiom

> Goal: Design idiom blocks

The __visual encoding idiom__ controls what the users see

The __interaction idiom__ controls how users change what they see

### Algorithm

> GOAL: Implement algorithm

Implement algorithms that efficiently handle visual encoding and interaction idioms

### Threats to validity

Domain Situation

- You misunderstood their needs

Data/Task Abstraction

- You're showing them the wrong thing

Visual encoding/interacion idiom

- The way you show it doesn't work

Algorithm

- Your code is slow

#### Domain Validation

Conduct a field study

- observe how users act in the real-world settings

For downstream validation, you can observe the adoption rate of the users

#### Abstraction Validation

You can conduct a case study to validate task/data abstraction

- Ask members of the target user community to use the tool

#### Idiom validation

As immediate justification for your idiom, you should justify your idiom choices

You can conduct a lab study

Quantitative

- time spend, number of errors

Qualitative

- questionnaires, interviews

#### Algorithm Validation

Analyze computational complexity

Conduct benchmarks

### 2 Angles of Attack for Vis Design

Problem-driven work

- start at the top domain situation level

- walk your way down through abstraction, idiom, and algorithm decisions

> Top-down approach

Technique-driven work

- work at one of the bottom two levels, idiom or algorithm

> Bottom-up approach
