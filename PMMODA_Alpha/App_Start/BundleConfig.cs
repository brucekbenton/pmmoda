using System.Web;
using System.Web.Optimization;

namespace PMMODA_Alpha
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/StyleSheet1.css"));

            bundles.Add(new ScriptBundle("~/pmmoda").Include(
                    "~/Scripts/organization.js",
                    "~/Scripts/cookieManagement.js",
                    "~/Scripts/homePage.js",
                    "~/Scripts/ContextMenu.js",
                    "~/Scripts/Deliverable.js",
                    "~/Scripts/DeliverableDisplay.js",
                    "~/Scripts/DeliverableModel.js",
                    "~/Scripts/Dimension.js",
                    "~/Scripts/DimensionCollection.js",
                    "~/Scripts/DimensionForm.js",
                    "~/Scripts/DimensionModel.js",
                    "~/Scripts/LoginForm.js",
                    "~/Scripts/NaturalUnit.js",
                    "~/Scripts/NaturalUnitCollection.js",
                    "~/Scripts/naturalUnitDisplayControl.js",
                    "~/Scripts/NaturalUnitEffortModel.js",
                    "~/Scripts/NaturalUnitForm.js",
                    "~/Scripts/NaturalUnitModel.js",
                    "~/Scripts/NaturalUnitModelControl.js",
                    "~/Scripts/Project.js",
                    "~/Scripts/ProjectCollection.js",
                    "~/Scripts/ProjectDetaiForm.js",
                    "~/Scripts/ProjectForm.js",
                    "~/Scripts/Role.js",
                    "~/Scripts/ScopeModelControl.js",
                    "~/Scripts/UnitDimension.js",
                    "~/Scripts/User.js",
                    "~/Scripts/Staff.js",
                    "~/Scripts/RoleEffortModel.js"));

        }
    }
}
