import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Phone, Save, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSupportPhoneNumber, updateSupportPhoneNumberAction } from "../store";
import { showError } from "@/lib/utils/toast";

const phoneNumberSchema = Yup.object().shape({
  phone_number: Yup.string()
    .required("Phone number is required")
    .min(5, "Phone number must be at least 5 characters"),
});

export default function SupportPhoneNumber() {
  const dispatch = useAppDispatch();
  const { supportPhoneNumber, isLoading, isUpdating } = useAppSelector((state) => state.settings);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!supportPhoneNumber) {
      dispatch(fetchSupportPhoneNumber());
    }
  }, [dispatch, supportPhoneNumber]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      phone_number: supportPhoneNumber || "",
    },
    validationSchema: phoneNumberSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(updateSupportPhoneNumberAction({ phone_number: values.phone_number.trim() })).unwrap();
        setIsEditing(false);
      } catch (error: any) {
        // Error is already handled in the thunk with toast notification
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  if (isLoading && !supportPhoneNumber) {
    return (
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--admin-primary)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Phone className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--admin-text)]">Support Phone Number</h3>
          <p className="text-sm text-[var(--admin-text-muted)]">
            Update the contact number displayed to users for support
          </p>
        </div>
      </div>

      {!isEditing ? (
        <div className="flex items-center justify-between p-4 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg">
          <div>
            <p className="text-sm text-[var(--admin-text-muted)] mb-1">Current Phone Number</p>
            <p className="text-lg font-medium text-[var(--admin-text)]">
              {supportPhoneNumber || "Not set"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Edit
          </button>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Phone Number *
            </label>
            <input
              id="phone_number"
              name="phone_number"
              type="text"
              value={formik.values.phone_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all ${
                formik.touched.phone_number && formik.errors.phone_number
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
              }`}
              placeholder="+966 9200 09339"
            />
            {formik.touched.phone_number && formik.errors.phone_number && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.phone_number}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdating}
              className="flex-1 px-4 py-2.5 border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] hover:bg-[var(--admin-bg)] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-4 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

