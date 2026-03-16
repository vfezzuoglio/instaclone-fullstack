using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstaClone.Api.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet("private")]
    [Authorize]
    public IActionResult Private()
        => Ok(new { message = "JWT works!" });
}
