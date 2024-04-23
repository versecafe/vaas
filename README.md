# VAAS

Retrieving your Vercel Analytics data for external use has never been easier.

<img width="1379" alt="image" src="https://github.com/versecafe/vaas/assets/147033096/079545ba-7927-4e41-b77b-2e7035b91388">

<img width="1379" alt="image" src="https://github.com/versecafe/vaas/assets/147033096/a08d06ad-32cf-44e8-9387-9cd84a290790">

## Get back data in your prefered format

<table align="center">
<tr>
<th>JSON</th>
<th>CSV</th>
<th>YAML</th>
</tr>
<tr>
<td>

```json
[
  {
    "key": "2024-03-24",
    "views": 32,
    "visitors": 24
  },
  {
    "key": "2024-03-25",
    "views": 183,
    "visitors": 72
  },
  {
    "key": "2024-03-26",
    "views": 569,
    "visitors": 216
  }
]
```

</td>
<td>

```csv
key,total,devices

2024-03-24,32,24
2024-03-25,183,72
2024-03-26,569,216
```

</td>
<td>

```yaml
data:
  - key: 2024-03-24
    total: 32
    devices: 24
  - key: 2024-03-25
    total: 183
    devices: 72
  - key: 2024-03-26
    total: 569
    devices: 216
```

</td>
</tr>
</table>

## Filters

### Basic Filter Options

```json
{"path":{"values":["/path/to/page"],"operator":"eq"}}
{ "referrer": { "values": ["https://duckduckgo.com"], "operator": "eq" } }
{ "country": { "values": ["US"], "operator": "eq" } }
{ "device": { "values": ["Desktop"], "operator": "eq" } }
{ "os": { "values": ["Mac"], "operator": "eq" } }
{ "browser": { "values": ["Chrome"], "operator": "eq" } }
{ "event_name": { "values": ["Event"], "operator": "eq" } }
{ "event_data": { "properties": { "quiz": "Property Name" }, "operator": "eq" }
```

### Building advanced filter queries

```json
{ "event_name": { "values": ["Test Submission"], "operator": "eq" } }
```

Filter further by specific event properties

```json
{
  "event_name": { "values": ["Test Submission"], "operator": "eq" },
  "event_data": {
    "properties": { "quiz": "MV2G Intelligence Assessment" },
    "operator": "eq"
  }
}
```

Add external filter such as Nation

```json
{
  "event_name": { "values": ["Test Submission"], "operator": "eq" },
  "event_data": {
    "properties": { "quiz": "MV2G Intelligence Assessment" },
    "operator": "eq"
  },
  "country": { "values": ["US"], "operator": "eq" }
}
```

## Run it yourself

Vaas has no env vars, so all you need to do is clone the repo and run the following commands:

```bash
bun i && bun dev
```
