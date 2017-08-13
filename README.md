Put back blacklisted climate change phrases
==================

Put back climate change phrases that the Trump administration has blacklisted https://www.theguardian.com/environment/2017/aug/07/usda-climate-change-language-censorship-emails.

You can deploy your own analytics instance if you want https://github.com/buren/climate-change-substitutions-analytics/.

## Analytics

:information_source: __Default is opt-in__.

You can optionally configure analytics.

- Turn if on/off
- Use the default analytics address
- Deploy your own instance of this app https://github.com/buren/climate-change-substitutions-analytics/.
- Build your own, see the request payload format below

If activated the extension will post replacements stats to the configured URL.

`POST /<optional-path>`

__Payload__:

```json
{
  "replacements": [{
    "url": "http://example.com",
    "original": "some phrase",
    "replacement": "my phrase"
  }]
}
```
